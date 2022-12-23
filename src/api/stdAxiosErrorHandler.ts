export function getAxiosErrorText(err: any, fullInfo = false) {
  let objToStringify = err?.response?.data ?? {};
  if (!fullInfo) {
    objToStringify = {
      status: [objToStringify.status, objToStringify.name].filter(Boolean).join(' '),
      message: err.response.data.message,
    };
  }

  return Object.entries(objToStringify)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}
