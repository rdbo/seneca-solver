console.log("Soneca initializing...");

const contentUrlRegex = "^.*://course-cdn-v2\.app\.senecalearning\.com/api/courses/.+/sections/.*\?Policy=.*$";
var currentContentUrl = "";

function parseContent(contentJson) {
    let contents = contentJson["contents"];
    console.log("Content JSON: " + JSON.stringify(contentJson));
    $.map(contents, function (obj) {
        $.map(obj["contentModules"], function (obj) {
            let moduleType = obj["moduleType"];
            let content = obj["content"];

            switch (moduleType) {
                case "multiple-choice": {
                    console.log("Q: " + content["question"]);
                    console.log("A: " + content["correctAnswer"]);
                    console.log("Wrong answers: ");
                    $.map(content["wrongAnswers"], function (obj) {
                        console.log(" - " + obj);
                    });
                    break;
                }
                
                case "list": case "mindmap": {
                    console.log("Q: " + content["statement"]);
                    $.map(content["values"], function (obj) {
                        let answer = "A: ";
                        $.map(obj["value"], function (value) {
                            if (value.hasOwnProperty("word")) {
                                answer = answer + "_" + value["word"] + "_";
                            } else {
                                answer = answer + value;
                            }
                        });
                        console.log(answer);
                    });
                    break;
                }
                
                case "wordfill":
                case "image-description": {
                    let answer = "A: ";
                    $.map(content["words"], function (obj) {
                        if (obj.hasOwnProperty("word")) {
                            answer = answer + "_" + obj["word"] + "_";
                        } else {
                            answer = answer + obj;
                        }
                    });
                    console.log(answer);
                    break;
                }

                case "multiSelect": {
                    console.log("Q: " + content["question"]);
                    $.map(content["options"], function (option) {
                        console.log("A: " + option["text"] + " : ", option["correct"] ? "correct" : "incorrect");
                    });
                    break;
                }
                
                case "image-label": {
                    console.log("Q: " + content["title"]);
                    $.map(content["labels"], function (label) {
                        let answer = "A: ";
                        $.map(label["word"]["processedWord"], function (obj) {
                            if (obj.hasOwnProperty("word")) {
                                answer = answer + "_" + obj["word"] + "_";
                            } else {
                                answer = answer + obj;
                            }
                        });
                        console.log(answer);
                    });
                    break;
                }
                
                case "grid": {
                    console.log("Q: " + content["title"]);
                    $.map(content["definitions"], function (obj) {
                        let answer = "A: ";
                        if (obj.hasOwnProperty("word") && obj.hasOwnProperty("text")) {
                            answer = answer + "_" + obj["word"] + "_" + obj["text"];
                        } else {
                            $.map(obj["word"], function (obj) {
                                if (obj.hasOwnProperty("word")) {
                                    answer = answer + "_" + obj["word"] + "_";
                                } else {
                                    answer = answer + obj;
                                }
                            });
                        }
                        answer = answer + " -> " + obj["text"];
                        console.log(answer);
                    });
                    break;
                }

                case "exact-list": case "image-list": {
                    if (content.hasOwnProperty("pretestQuestion")) {
                        console.log("Q: " + content["pretestQuestion"]);
                        console.log("A: " + content["prestestCorrectAnswer"]);
                        console.log("Wrong Answers: ")
                        $.map(content["prestestWrongAnswers"], function (obj) {
                            console.log(" - " + obj);
                        })
                    }

                    console.log("Q: " + content["statement"]);
                    $.map(content["values"], function (obj) {
                        let answer = "A: ";
                        $.map(obj["value"], function (obj) {
                            if (obj.hasOwnProperty("word"))
                                answer = answer + "_" + obj["word"] + "_";
                            else
                                answer = answer + obj;
                        });
                        console.log(answer);
                    });
                    break;
                }
                
                case "flow": {
                    console.log("Q: " + content["instruction"]);
                    console.log("A: ");
                    $.each(content["orderedValues"], function (index, obj) {
                        console.log(" ", index + 1, ") ", obj);
                    });
                    break;
                }

                case "wrong-word": {
                    let answer = "A: ";
                    $.map(content["sentence"], function (obj) {
                        if (obj.hasOwnProperty("word")) {
                            answer = answer + "[" + obj["word"] + "]";
                        } else {
                            answer = answer + obj;
                        }
                    })
                    console.log(answer);
                    break;
                }

                case "concept": case "text-block":
                case "hierarchy": case "pattern": {
                    console.log("Skipped module: " + moduleType);
                    break;
                }

                default: {
                    console.log("Unknown module: " + moduleType);
                    break;
                }
            }

            console.log("====================");
        });
    });
}

function handleRequest(details) {
    if (currentContentUrl != details.url && details.url.match(contentUrlRegex)) {
        console.log("Content URL found");
        console.log("Previous Content URL: " + currentContentUrl);

        currentContentUrl = details.url; // Prevent proxy from catching its own requests to the content URL
        console.log("Current Content URL: " + currentContentUrl);

        $.get(currentContentUrl, parseContent);
    }
}

browser.proxy.onRequest.addListener(handleRequest, { urls : ["*://*.senecalearning.com/*"] })

console.log("Soneca initialized");
