// src/validation/assert.ts
function isEmpty(value) {
  return isNull(value) || Array.isArray(value) && value.length === 0 || typeof value === "object" && !!value && Object.keys(value).length === 0 || typeof value === "string" && value?.length === 0;
}
function notEmpty(value) {
  return !isEmpty(value);
}
function isNull(value) {
  return value === null || typeof value === "undefined";
}
function notNull(value) {
  return !isNull(value);
}
function throwIfEmpty(value, message) {
  if (isEmpty(value)) {
    throw new Error(message, { cause: { code: "IsEmpty" } });
  }
}
function throwIfNull(value, message) {
  if (isNull(value)) {
    throw new Error(message, { cause: { code: "IsNull" } });
  }
}
export {
  throwIfNull,
  throwIfEmpty,
  notNull,
  notEmpty,
  isNull,
  isEmpty
};

//# debugId=C54263A62E064A1D64756E2164756E21
//# sourceMappingURL=index.js.map
