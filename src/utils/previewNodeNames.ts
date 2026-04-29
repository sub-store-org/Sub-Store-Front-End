import yaml from 'js-yaml';

export type PreviewNodeNameSide = 'before' | 'after';

export interface PreviewNodeInfo {
  name: string;
  type: string;
}

export const PREVIEW_NODE_INFO_PROMPT_REFERENCE = [
  'function operator(proxies, targetPlatform, context) {',
  '  // 更多需求 可参考 https://raw.githubusercontent.com/sub-store-org/Sub-Store/refs/heads/master/scripts/demo.js',
  '  // Sub-Store 脚本教程合集 https://t.me/zhetengsha/214',
  '  return proxies.map(proxy => {',
  '    // 订阅名称',
  '    const subName = proxy._subDisplayName || proxy._subName ',
  '',
  '    // 提取特征文本用于识别旗帜',
  '    const geoStr = proxy.name.match(/一段正则/)?.[1]',
  '',
  '    // 从特征文本得到旗帜 并替换掉旗帜(因为某些旗帜在某些平台上无法显示)',
  '    // ProxyUtils.getFlag 源码 https://raw.githubusercontent.com/sub-store-org/Sub-Store/refs/heads/master/backend/src/utils/geo.js, 支持大部分常见文本的识别, 不局限于 ISO 3166-1 alpha-2 或 emoji 旗帜',
  "    const flag = ProxyUtils.getFlag(geoStr).replace(/🇹🇼/g, '🇼🇸')",
  '    // 从特征文本得到 ISO 3166-1 alpha-2',
  '    const iso = ProxyUtils.getISO(geoStr)',
  '',
  '    // 提取协议类型',
  '    const type = proxy.type',
  '',
  '    // 组合赋值实现重命名',
  '    proxy.name = `${flag} ${iso} [${type}] ${proxy.name}` ',
  '    return proxy;',
  '  });',
  '}',
].join('\n');

const NODE_ARRAY_KEYS = [
  'proxies',
  'proxy',
  'nodes',
  'servers',
  'outbounds',
  'original',
  'processed',
];

const NODE_HINT_KEYS = [
  'server',
  'port',
  'type',
  'password',
  'uuid',
  'UUID',
  'addresses',
  'udp',
  'tfo',
  'skip-cert-verify',
];

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const addNodeInfo = (nodeInfos: PreviewNodeInfo[], value: Record<string, any>) => {
  const name = normalizeText(value.name);
  if (!name) {
    return;
  }

  nodeInfos.push({
    name,
    type: normalizeText(value.type),
  });
};

const isPlainRecord = (value: unknown): value is Record<string, any> => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

const isNodeLikeRecord = (value: Record<string, any>) => {
  if (!normalizeText(value.name)) {
    return false;
  }

  return NODE_HINT_KEYS.some(key => key in value);
};

const parseStructuredText = (value: string) => {
  const text = value.trim();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // Not JSON. Try YAML below.
  }

  try {
    return yaml.load(text);
  } catch (e) {
    return null;
  }
};

const collectNodeInfos = (
  value: unknown,
  nodeInfos: PreviewNodeInfo[],
  depth = 0,
) => {
  if (value == null || depth > 8) {
    return;
  }

  if (typeof value === 'string') {
    const parsed = parseStructuredText(value);
    if (parsed !== null && parsed !== value) {
      collectNodeInfos(parsed, nodeInfos, depth + 1);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => {
      if (isPlainRecord(item) && typeof item.name === 'string') {
        addNodeInfo(nodeInfos, item);
      } else if (isPlainRecord(item) && typeof item.tag === 'string') {
        addNodeInfo(nodeInfos, {
          name: item.tag,
          type: item.type,
        });
      } else {
        collectNodeInfos(item, nodeInfos, depth + 1);
      }
    });
    return;
  }

  if (!isPlainRecord(value)) {
    return;
  }

  if (isNodeLikeRecord(value)) {
    addNodeInfo(nodeInfos, value);
    return;
  }

  NODE_ARRAY_KEYS.forEach(key => {
    if (key in value) {
      collectNodeInfos(value[key], nodeInfos, depth + 1);
    }
  });
};

export const extractPreviewNodeInfos = (value: unknown) => {
  const nodeInfos: PreviewNodeInfo[] = [];
  collectNodeInfos(value, nodeInfos);
  return nodeInfos;
};

export const extractPreviewSideNodeInfos = (
  previewData: any,
  side: PreviewNodeNameSide,
) => {
  const primaryKey = side === 'after' ? 'processed' : 'original';
  const primaryNodeInfos = extractPreviewNodeInfos(previewData?.[primaryKey]);

  if (primaryNodeInfos.length > 0) {
    return primaryNodeInfos;
  }

  if (side === 'after') {
    return extractPreviewNodeInfos(previewData);
  }

  return [];
};

export const formatPreviewNodeInfos = (nodeInfos: PreviewNodeInfo[]) => {
  return nodeInfos
    .map(({ name, type }) => `{ "name": ${JSON.stringify(name)}, "type": ${JSON.stringify(type)} }`)
    .join('\n');
};

export const formatPreviewNodeInfoPrompt = (nodeInfos: PreviewNodeInfo[]) => {
  return [
    '写一段 JavaScript 代码, 参考:',
    '```',
    PREVIEW_NODE_INFO_PROMPT_REFERENCE,
    '```',
    '以实现将',
    '```',
    formatPreviewNodeInfos(nodeInfos),
    '```',
    '转换为',
    '```',
    '["订阅名"] "国家地区 Emoji" "ISO 3166-1 alpha-2" ["协议类型"] "防重名序数" ',
    '```',
    '的格式',
    '写得更通用一些, 以适应其他新的节点名',
  ].join('\n');
};

export const formatPreviewNodeNames = (nodeInfos: PreviewNodeInfo[]) => {
  return nodeInfos.map(({ name }) => name).join('\n');
};
