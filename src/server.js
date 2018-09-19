let env = window.env || {};
let p = env.apiProtocol || "http";
let h = env.apiHost || "localhost";
let cp = env.apiPort ? ":" + env.apiPort : "";
let prefix = env.apiPrefix ? "/" + env.apiPrefix : "";

export const httpRoot = p + "://" + h + cp + prefix;
export const wsRoot = "ws://" + h + cp + prefix;
