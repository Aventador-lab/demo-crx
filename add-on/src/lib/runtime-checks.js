'use strict' 

function getBrowserInfo(browser) {
  if(browser && browser.runtime && browser.runtime.getBrowserInfo){
    return browser.runtime.getBrowserInfo()
  }
  return Promise.resolve({})
}

function getPlatformInfo(browser) {
  if(browser && browser.runtime && browser.runtime.getPlatformInfo) {
    return browser.runtime.getPlatformInfo()
  }
  return Promise.resolve()
}

function hasChromeSocketsForTcp() {
  return typeof chrome === 'object' &&
    typeof chrome.runtime === 'object' &&
    typeof chrome.runtime.id === 'string' &&
    typeof chrome.sockets === 'object' &&
    typeof chrome.sockets.tcpServer === 'object' &&
    typeof chrome.sockets.tcp === 'object'
}

async function createRuntimeChecks(browser) {
  const { name, version } = await getBrowserInfo(browser)
  const isFirefox = name && (name.includes('Firefox') || name.includes('Fennec'))

  const hasNativeProtocolHandler = !!(browser && browser.protocol && browser.protocol.registerStringProtocol)

  const platformInfo = await getPlatformInfo(browser)
  const isAndroid = platformInfo ? platformInfo.os === 'android' : false

  return Object.freeze({
    browser,
    isFirefox,
    isAndroid,
    isBrave:hasChromeSocketsForTcp(),
    requiresXHRCORSfix:!!(isFirefox && version && version.startsWith('68')),
    hasChromeSocketsForTcp:hasChromeSocketsForTcp(),
    hasNativeProtocolHandler
  })
}

module.exports.createRuntimeChecks = createRuntimeChecks
module.exports.hasChromeSocketsForTcp = hasChromeSocketsForTcp
