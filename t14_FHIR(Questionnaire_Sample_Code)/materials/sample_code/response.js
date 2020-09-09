let url = "https://fhir.dicom.tw/fhir/QuestionnaireResponse";

var response = '{\
    "resourceType": "QuestionnaireResponse",\
    "questionnaire": "",\
    "status": "completed",\
    "subject": {\
        "reference": "",\
        "type": ""\
    },\
    "author": {\
        "reference": "",\
        "type": ""\
    },\
    "source": {\
        "reference": "",\
        "type": ""\
    },\
    "item": []\
}';

//取得網路上的資源
function HTTPGetData(urlStr, callback_fn) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            let ret = rawFile.responseText;
            callback_fn(ret);
        }
    }
    rawFile.send();
}

function HTTPPostData(urlStr, dataStr, callback_fn) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("POST", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        console.log(rawFile.readyState);
        if (rawFile.readyState === 4) {
            ret = rawFile.responseText;
            callback_fn(ret);
        }
    }
    rawFile.send(dataStr);
}

function post_response(questionnaire) {
    var res = JSON.parse(response);
    res.questionnaire = questionnaire.id;
    res.subject.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.subject.type = questionnaire.subjectType[0];
    res.author.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.author.type = questionnaire.subjectType[0];
    res.source.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.source.type = questionnaire.subjectType[0];
    var question_list = document.getElementsByTagName("li");
    for (let i = 0; i < question_list.length; i++) {
        let question_text = question_list.item(i).children.item(0).innerHTML;
        let response_value = question_list.item(i).children.item(1).value;
        let items = {
            "linkId": "",
            "text": "",
            "answer": []
        }
        items.linkId = (i + 1) + ".0";
        items.text = question_text;
        let valueType;
        if (!isNaN(response_value)) {
            valueType = { "valueInteger": parseInt(response_value) };
            items.answer.push(valueType);
        } else {
            valueType = { 'valueString': response_value };
            items.answer.push(valueType);
        }
        res.item.push(items);
    }
    let dataStr = JSON.stringify(res);
    HTTPPostData(url, dataStr, output);
}