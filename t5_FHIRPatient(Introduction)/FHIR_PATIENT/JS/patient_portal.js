function HTTPPutData(urlStr, dataStr) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("PUT", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            ret = rawFile.responseText;
            // alert(ret);
            alert("導向至登入頁面");
            window.open("portal.html");
        }
    }
    rawFile.send(dataStr);
}

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

function post_patient() {
    var patient = {
        "resourceType": "Patient",
        "id": "ax98234",
        "text": {
            "status": "generated"
        },
        "identifier": [{ // may reference https://www.hl7.org/fhir/v2/0203/index.html for more code
                "use": "usual",
                "type": {
                    "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MR"
                    }]
                },
                "assigner": {
                    "display": "Health Care for Christ"
                },
                "value": "003"
            },
            {
                "use": "official",
                "type": {
                    "text": "random",
                    "coding": [{
                        "system": "https://www.ris.gov.tw/app/en/3051",
                        "code": "PPN"
                    }]
                },
                "assigner": {
                    "display": "Department Of Household Registration"
                },
                "system": "https://www.ris.gov.tw/app/en/3051",
                "value": "AX9001234"
            },
            {
                "use": "official",
                "type": {
                    "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "NIIP"
                    }]
                },
                "assigner": {
                    "display": "Ministry Of Health Taiwan"
                },
                "system": "https://www.mohw.gov.tw/mp-2.html",
                "value": "1234"
            }
        ],
        "active": "true",
        "name": [{
            "use": "official",
            "family": "",
            "given": [
                ""
            ],
            "prefix": "mr",
            "text": ""
        }],
        "telecom": [{
                "system": "phone",
                "value": "",
                "use": "mobile"
            },
            {
                "system": "phone",
                "value": "",
                "use": "home"
            },
            {
                "system": "email",
                "value": "",
                "use": "mobile"
            }
        ],
        "gender": "male",
        "maritalStatus": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                "code": "M"
            }]
        },
        "contact": [{
            "relationship": "N",
            "name": [{
                "use": "official",
                "family": "",
                "given": [
                    ""
                ]
            }],
            "telecom": [{
                "system": "phone",
                "value": "",
                "use": "mobile"
            }],
            "gender": "male"
        }],
        "communication": [{
                "language": {
                    "coding": [{
                        "system": "urn:ietf:bcp:47",
                        "code": "zh-TW",
                        "display": "Chinese (Taiwan)"
                    }]
                },
                "preferred": false
            },
            {
                "language": {
                    "coding": [{
                        "system": "urn:ietf:bcp:47",
                        "code": "",
                        "display": ""
                    }]
                },
                "preferred": false
            }
        ],
        "birthDate": "1974-12-25",
        "deceasedBoolean": "false",
        "address": [{
                "use": "home",
                "text": "demo",
                "line": [
                    "demo"
                ],
                "city": "demo",
                "postalCode": "99999"
            },
            {
                "use": "work",
                "text": "demo",
                "line": [
                    "demo"
                ],
                "city": "demo",
                "postalCode": "demo"
            }
        ],
        "extension": [{
            "url": "http://hl7.org/fhir/registry",
            "extension": [{
                "url": "http://terminology.hl7.org/CodeSystem/v3-Race",
                "valueCodeableConcept": {
                    "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/v3-Race",
                        "code": "1002-5"
                    }]
                }
            }]
        }],
        "managingOrganization": {
            "reference": "Organization/jonah"
        }
    };
    // loading user's input
    patient.id = get_text_value("passport_number");
    for (i = 0; i < patient.identifier.length; i++)
        patient.identifier[i].value = get_text_value("passport_number");
    patient.name[0].prefix = get_dropdown_value("title");
    patient.name[0].given[0] = get_text_value("name");
    patient.gender = get_radio_value("gender");
    patient.birthDate = date_padding(get_text_value("YOB")) + "-" + date_padding(get_text_value("MOB")) + "-" + date_padding(get_text_value("DOB"));
    tel_id_postfix = ["mobile", "home", "email"];
    for (i = 0; i < patient.telecom.length; i++)
        patient.telecom[i].value = get_text_value("telecom_" + tel_id_postfix[i]);
    add_id_prefix = ["home", "work"];
    for (i = 0; i < add_id_prefix.length; i++) {
        patient.address[i].line = get_text_value(add_id_prefix[i] + "_address_line");
        patient.address[i].postalCode = get_text_value(add_id_prefix[i] + "_address_postal");
        patient.address[i].city = get_text_value(add_id_prefix[i] + "_address_city");
    }
    patient.maritalStatus.coding[0].code = get_dropdown_value("marital");
    patient.contact[0].relationship = get_dropdown_value("dependent_rel");
    patient.contact[0].name[0].given[0] = get_text_value("telecom_dependent_name");
    patient.contact[0].telecom[0].value = get_text_value("telecom_dependent_mobile");
    patient.contact[0].gender = get_radio_value("dependent_gender");
    var speak_twn_chinese = get_radio_value("userCommunication0");
    if (speak_twn_chinese == "no")
        patient.communication.shift(); // remove the top element from array
    else
        patient.communication[0].preferred = true;
    // patient object was pre-loaded with two language elements
    var other_language = get_dropdown_value("communicationLanguage");
    if (other_language == "----") // remove the last element
        patient.communication.pop();
    else { // filled up the last element
        patient.communication[patient.communication.length - 1].language.coding[0].code = other_language;
        patient.communication[patient.communication.length - 1].preferred = true;
    }
    patient.extension[0].extension[0].valueCodeableConcept.coding[0].code = get_dropdown_value("race");
    var url = "https://fhir.dicom.tw/fhir/Patient/" + patient.id;
    const data_string = JSON.stringify(patient);
    console.log(data_string);
    HTTPPutData(url, data_string);
}