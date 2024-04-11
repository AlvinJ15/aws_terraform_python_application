
import React from 'react'
//export const Ruta = process.env._RUTA_PRINCIPAL
export const Ruta = "https://api.tollaniscred.com/dev/"
export const ENDPOINT = "http://localhost:4001";//ENDPOINT_SERVER_SOCKET 
export const FetchData = (url, method = "GET", data = {}, headers = {}) => {
    if (Object.keys(headers).length === 0) {
        headers = {
            'Authorization': 'eyJraWQiOiJGZmU0aXMrOXJmRkVPUytpd2dMMGhrVkpyOHZLMmtIZ1BUb3JHbVhWRGFNPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiclAtNzJkNkRzUWdXbExvWXlFSzFkQSIsInN1YiI6ImUzMjIzNDgwLWIzN2UtNDkxMS04YzI0LTIxNzdkMjZhMjRjMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ZMndDM25sVUkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTMyMjM0ODAtYjM3ZS00OTExLThjMjQtMjE3N2QyNmEyNGMwIiwib3JpZ2luX2p0aSI6ImExMzIwZWQ1LWU2NjItNDU5NC1iZTQ1LTIxMDU5Y2RlYWVkOSIsImF1ZCI6Ijc1OTNmb3J0YjYwc3IxdWoyODNvcDBpY2RhIiwiZXZlbnRfaWQiOiIwOWIxNzJlYi04NmFlLTRiNjMtOWRmMi03N2U2MmYyNGMxMzUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxMjc3ODkyMiwiZXhwIjoxNzEyODY1MzIyLCJpYXQiOjE3MTI3Nzg5MjIsImp0aSI6IjY0NmVmYzVkLTViYzQtNDBkZC1iOWUzLWY3MWY1YTlhNGJjYiIsImVtYWlsIjoiYWx2aW4uY2h1bmdhQHRvbGxhbmlzLmNvbSJ9.oxpSKE-doS6SUvU0fXC28zV0OH8LexqG8mSa0OBjQT00skLZL3JIvYX7_mUEG9HfGEQPJKRwwGvoX7n5raVcYMmeIrh3bTyLeBM6TFAHoCjuCLWrXkoTnHpVoQgYCjIv77UNMJYV_LwDTGTiWdewzQHXiZ6b42thhg-AYrhMcUP8wwwh3M4v_xAdux7XkDuSjgDM0H4bdAJuWrDbdjMVrHfQd08qMCHvFhie4FsxvLB9M3oz8Z6db08G31ArfpKaHA_2OKq982t2YHpac-U763QlJhxd46ypPK1qucmQVTP_Bf35kd87P2mJESDBoF1t7f4R7aiPR0FwYe4m8kXswA',
        }
    }
    const body = {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
    }
    //console.log("my daata", data)
    if (Object.keys(data).length === 0) {
        delete body.body
    }
    return fetch(Ruta + url, body)
        .then(response => response.json())
        .catch(error => {
            alert("Please, reload")
        })
}

export default {
    FetchData, Ruta
    // ENDPOINT,
}
