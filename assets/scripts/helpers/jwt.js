export function parseJwt(jwt) {
    const parts = jwt.split(".")
    if (parts.length < 3)
        throw new Error("Incorrect token format")
    
    return {
        header: JSON.parse(base64UrlDecode(parts[0])),
        payloads: JSON.parse(base64UrlDecode(parts[1]))
    }
}

function base64UrlDecode(base64Url) {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    switch (base64.length % 4) {
        case 1:
            throw new Error('Invalid base64 string')
        case 2:
            base64 += '=='
            break
        case 3:
            base64 += '='
            break
    }

    return decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}