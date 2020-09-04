//取得網路上的資源
function HTTPGetData(urlStr, account_id, next_page) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            let ret = rawFile.responseText;
            console.log(ret);
            json_obj = JSON.parse(ret) // 轉換成JSON物件格式
            if (json_obj.total != 1) // 確定輸入姓名只取得一筆
                alert("姓名錯誤");
            else {
                if (json_obj.entry[0].resource.id != account_id) // 確定輸入帳號與取回來的帳號相符
                    alert("賬號錯誤");
                else { // 成功!
                    console.log("Redirecting...");
                    create_cookies(json_obj.entry[0].resource.name[0].given[0], json_obj.entry[0].resource.id);
                    window.open(next_page); // 導向新一頁
                }
            }
        }
    }
    rawFile.send();
}