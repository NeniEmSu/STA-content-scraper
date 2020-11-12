const puppeteer = require("puppeteer");
const fs = require("fs");

process.setMaxListeners(Infinity);

const { scrapeFromK1, scrapeFromK2 } = require("./scrapingInfo");

const scrapeForKrok = async (element) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(element.link);

    let QuizTemp = {
      wpProQuiz: {
        header: {
          _version: "0.37",
          _exportVersion: "1",
        },
        data: {
          quiz: {
            title: {
              _titleHidden: "false",
              __cdata: element.title,
            },
            text: {
              __cdata: element.title,
            },
            category: element.category,
            resultText: {
              _gradeEnabled: "false",
              __cdata: "",
            },
            btnRestartQuizHidden: "false",
            btnViewQuestionHidden: "false",
            questionRandom: "false",
            answerRandom: "false",
            timeLimit: "0",
            showPoints: "false",
            statistic: {
              _activated: "true",
              _ipLock: "1440",
            },
            quizRunOnce: {
              _type: "1",
              _cookie: "false",
              _time: "0",
              __text: "false",
            },
            numberedAnswer: "false",
            hideAnswerMessageBox: "true",
            disabledAnswerMark: "false",
            showMaxQuestion: {
              _showMaxQuestionValue: "1",
              _showMaxQuestionPercent: "false",
              __text: "false",
            },
            toplist: {
              toplistDataAddPermissions: "1",
              toplistDataSort: "1",
              toplistDataAddMultiple: "false",
              toplistDataAddBlock: "1",
              toplistDataShowLimit: "1",
              toplistDataShowIn: "0",
              toplistDataCaptcha: "false",
              toplistDataAddAutomatic: "false",
              _activated: "false",
            },
            showAverageResult: "true",
            prerequisite: "false",
            showReviewQuestion: "true",
            quizSummaryHide: "false",
            skipQuestionDisabled: "false",
            emailNotification: "0",
            userEmailNotification: "false",
            showCategoryScore: "true",
            hideResultCorrectQuestion: "false",
            hideResultQuizTime: "false",
            hideResultPoints: "false",
            autostart: "false",
            forcingQuestionSolve: "false",
            hideQuestionPositionOverview: "false",
            hideQuestionNumbering: "false",
            sortCategories: "true",
            showCategory: "true",
            quizModus: {
              _questionsPerPage: "0",
              __text: "2",
            },
            startOnlyRegisteredUser: "false",
            adminEmail: {
              to: "",
              form: "",
              subject: "Wp-Pro-Quiz: One user completed a quiz",
              html: "false",
              message: {
                __cdata:
                  'Wp-Pro-Quiz\n\nThe user "$username" has completed "$quizname" the quiz.\n\nPoints: $points\nResult: $result',
              },
            },
            userEmail: {
              to: "-1",
              toUser: "false",
              toForm: "false",
              form: "",
              subject: "Wp-Pro-Quiz: One user completed a quiz",
              html: "false",
              message: {
                __cdata:
                  'Wp-Pro-Quiz\n\nYou have completed the quiz "$quizname".\n\nPoints: $points\nResult: $result',
              },
            },
            forms: {
              _activated: "false",
              _position: "0",
            },
            questions: { question: [] },
          },
        },
      },
    };

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
      QuizTemp.wpProQuiz.data.quiz.questions.question.push({
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

    fs.writeFileSync(element.saveTo, JSON.stringify(QuizTemp));
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
};

// scrapeFromK1.forEach((element) => {
//   scrapeForKrok(element);
// });

scrapeFromK2.forEach((element) => {
  scrapeForKrok(element);
});
