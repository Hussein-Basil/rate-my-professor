const getCookie = (key, cookies) => {
    const val = cookies.match('(^|;) ?' + key + '=([^;]*)(;|$)')
    return val ? val[2] : null
}

module.exports = { getCookie }