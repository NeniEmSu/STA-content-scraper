const puppeteer = require("puppeteer");
const fs = require("fs");

process.setMaxListeners(Infinity);

const { scrapeFromK1, scrapeFromK2 } = require("./scrapingInfo");

const scrapeForKrok = async (element) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(element.link);

  let questions = { question: [] };

  for (let i = 2, j = 1; i <= element.qNumber * 2; i += 2, j++) {
    const [getTitleXpath] = await page.$x(
      `/html/body/div[2]/div[2]/div[${i - 1}]/div[1]/b`
    );
    const getTitle = await page.evaluate(
      (name) => name.innerText,
      getTitleXpath
    );
    const [getQuestionXpath] = await page.$x(
      `/html/body/div[2]/div[2]/div[${i}]`
    );
    const getQuestion = await page.evaluate(
      (name) => name.innerText,
      getQuestionXpath
    );
    const [getCAXpath] = await page.$x(
      `/html/body/div[2]/div[2]/ul[${j}]/li[1]`
    );
    const getCorrectAns = await page.evaluate(
      (name) => name.innerText,
      getCAXpath
    );
    let options = [];

    for (let k = 2; k <= 5; k++) {
      const [getOptionsXpath] = await page.$x(
        `/html/body/div[2]/div[2]/ul[${j}]/li[${k}]`
      );
      const getOption = await page.evaluate(
        (name) => (name ? name.innerText : "-"),
        getOptionsXpath
      );
      options.push(getOption);
    }
    questions.question.push({
      title: {
        __cdata: getTitle,
      },
      points: "1",
      questionText: {
        __cdata: getQuestion,
      },
      _answerType: "single",
      incorrectMsg: {
        __cdata: "",
      },
      tipMsg: {
        _enabled: "false",
        __cdata: "",
      },
      correctMsg: {
        __cdata: `"years": [${element.year}] \n Exp: \n `,
      },
      category: "",
      correctSameText: "true",
      showPointsInBox: "false",
      answerPointsActivated: "false",
      answerPointsDiffModusActivated: "false",
      disableCorrect: "false",
      answers: {
        answer: [
          {
            _points: "1",
            _correct: "true",
            stortText: {
              _html: "true",
              __cdata: "",
            },
            answerText: {
              _html: "true",
              __cdata: getCorrectAns,
            },
          },
          {
            _points: "1",
            _correct: "false",
            stortText: {
              _html: "true",
              __cdata: "",
            },
            answerText: {
              _html: "true",
              __cdata: options[0],
            },
          },
          {
            _points: "1",
            _correct: "false",
            stortText: {
              _html: "true",
              __cdata: "",
            },
            answerText: {
              _html: "true",
              __cdata: options[1],
            },
          },
          {
            _points: "1",
            _correct: "false",
            stortText: {
              _html: "true",
              __cdata: "",
            },
            answerText: {
              _html: "true",
              __cdata: options[2],
            },
          },
          {
            _points: "1",
            _correct: "false",
            stortText: {
              _html: "true",
              __cdata: "",
            },
            answerText: {
              _html: "true",
              __cdata: options[3],
            },
          },
        ],
      },
    });
  }

  fs.writeFileSync(element.saveTo, JSON.stringify({ questions }));

  await browser.close();
};

// scrapeFromK1.forEach((element) => {
//   scrapeForKrok(element);
// });

scrapeFromK2.forEach((element) => {
  scrapeForKrok(element);
});
