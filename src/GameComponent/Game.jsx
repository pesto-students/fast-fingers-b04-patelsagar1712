import React, { Component } from "react";
import CountDownTimer from "../timerCounter/Countdown";
import data from "../data/dictionary.json";
import "./Game.css";
class startScreen extends Component {
  constructor(props) {
    super(props);
    this.currentState = {
      name: "",
      difficulty: 0,
      selecteddifficulty: "Easy",
      currDifficulty: 0,
      startGameFlag: false,
      startTimeFlag: false,
      gameOverFlag: false,
      currentWord: "",
      currentScore: 0,
      userInput: "",
      easyWords: [],
      mediumWords: [],
      hardWords: [],
      bestScore: 0,
      bestScoreFlag: false,
      bestScoreId: 0,
      nameError: "",
    };
    this.state = { ...this.currentState };
    this.scoreList = [];

    //Spliting all the words into differenet variables
    let easyWordFlag = true,
      medWordFlag = true,
      hardWordFlag = true;

    for (let word of data) {
      if (word.length <= 4 && easyWordFlag) {
        this.state.easyWords.push(word);
      } else if (word.length <= 8 && medWordFlag)
        this.state.mediumWords.push(word);
      else if (hardWordFlag) this.state.hardWords.push(word);

      //For Optimization for delay
      // if (this.state.easyWords.length === 150) easyWordFlag = false;
      // if (this.state.mediumWords.length === 150) medWordFlag = false;
      // if (this.state.hardWords.length === 500) hardWordFlag = false;
    }
  }
  state = {};
  //Method to save Name from UI
  addName = (e) => {
    this.setState({ name: e.target.value });
  };
  //Method to save selected Difficulty
  selectDifficulty = (e) => {
    this.setState({ selectDifficulty: e.target.value });
  };
  //Method to check whether Name has been written
  validateName = () => {
    if (this.state.name === "" || this.state.name.length === 0) {
      this.setState({ nameError: "Please Enter Name" });
      return false;
    } else {
      this.setState({ nameError: "" });
      return true;
    }
  };
  //Method to validate, pre-check  and set variables to start game
  saveValue = () => {
    if (this.validateName()) {
      this.setDifficulty();
      this.setState({ startGameFlag: true, startTimeFlag: true });
    }
  };
  //Method to get scoreList
  getScoreList = () => {
    if (this.scoreList.length === 0) {
      return;
    }
    const scoresList = this.scoreList.map((score, i) => (
      <p key={i}>
        <p className="score-text">
          {this.state.bestScoreId === i ? "Personal Best" : null}
        </p>
        <p className="text-white">{`Score #${i + 1}: ${score}`}</p>
      </p>
    ));
    return scoresList;
  };
  //Method to find best Sccore
  bestScore = () => {
    if (this.state.currentScore > this.state.bestScore) {
      this.setState({
        bestScore: this.state.currentScore,
        bestScoreFlag: true,
        bestScoreId: this.scoreList.length - 1,
      });
    } else {
      this.setState({
        ...this.state,
        bestScoreFlag: false,
      });
    }
  };
  //Method called when Game is over
  onGameOver = () => {
    this.scoreList.push(this.state.currentScore);
    this.bestScore();
    this.setState({ ...this.state, gameOverFlag: true });
  };
  //Method called when stop is clicked
  onStop = () => {
    this.bestScore();
    this.scoreList.push(this.state.currentScore);
    this.setState({ ...this.state, gameOverFlag: true });
  };
  //Method to set current score to Score list
  setScore = (value) => {
    this.setState({ ...this.state, currentScore: value });
  };
  //Method to set and restart Game
  onPlayAgain = () => {
    this.setState(
      { ...this.INITIAL_STATE, gameOverFlag: false, userInput: "" },
      this.setDifficulty
    );
  };
  //Method to update difficulty, find new word from the currdifficulty and calculate time
  setDifficulty = () => {
    let difficultyFactor;
    let difficulty = this.state.selectDifficulty;
    let newWord;
    if (difficulty === "Easy" || difficulty === undefined) {
      difficulty = "Easy";
      difficultyFactor = 1;
      const random = Math.round(
        Math.random() * (this.state.easyWords.length - 1)
      );
      newWord = this.state.easyWords[random].toUpperCase();
    } else if (difficulty === "Medium") {
      difficultyFactor = 1.5;
      const random = Math.round(
        Math.random() * (this.state.mediumWords.length - 1)
      );
      newWord = this.state.mediumWords[random].toUpperCase();
    } else {
      difficultyFactor = 2;
      const random = Math.round(
        Math.random() * (this.state.hardWords.length - 1)
      );
      newWord = this.state.hardWords[random].toUpperCase();
    }
    const timeForWord = Math.floor(newWord.length / difficultyFactor) + 1;
    this.setState({
      ...this.state,
      startTimer: true,
      currentWord: newWord,
      timeForWord: timeForWord,
      selectDifficulty: difficulty,
      difficulty: difficulty,
      difficultyFactor: difficultyFactor,
      currDifficulty: difficultyFactor,
    });
  };
  //Method to check user input and validate whether it is correct
  checkCurrentWord = () => {
    const currWordChar = this.state.currentWord.split("");
    const currUserChar = this.state.userInput.split("");
    return (
      <div className="new-word">
        {currWordChar.map((char, i) => {
          let color;
          if (i < this.state.userInput.length) {
            color = char === currUserChar[i] ? "green" : "red";
          }
          return (
            <span key={i} style={{ color: color }}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };
  //Method to get new Word from current difficulty
  getNewWord = (words, difficultyFactor = null) => {
    if (difficultyFactor >= 1.5 && difficultyFactor < 2) {
      const random = Math.round(Math.random() * (words.length - 1));
      return words[random].toUpperCase();
    }
    if (difficultyFactor < 1.5) {
      const random = Math.round(Math.random() * (words.length - 1));
      return words[random].toUpperCase();
    }
    const random = Math.round(Math.random() * (words.length - 1));
    return words[random].toUpperCase();
  };
  //Method for curr difficulty and return new words to UI
  onUserInput = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === this.state.currentWord) {
      const difficultyFactor = this.state.currDifficulty + 0.01;

      let level, words;
      if (difficultyFactor >= 2) {
        level = "Hard";
        words = this.state.hardWords;
      } else if (difficultyFactor < 1.5) {
        level = "Easy";
        words = this.state.easyWords;
      } else {
        level = "Medium";
        words = this.state.mediumWords;
      }

      const newWord = this.getNewWord(words, difficultyFactor);
      const timeForWord = Math.floor(newWord.length / difficultyFactor) + 1;

      this.setState({
        ...this.state,
        currentWord: newWord,
        userInput: "",
        timeForWord: timeForWord,
        level: level,
        difficulty: level,
        difficultyFactor: parseFloat(difficultyFactor.toFixed(2)),
        currDifficulty: parseFloat(difficultyFactor.toFixed(2)),
      });
    } else {
      this.setState({ ...this.state, userInput: value });
    }
  };

  render() {
    console.log(this.state);
    let counterComponent;
    if (this.state.gameOverFlag) {
      return (
        <div>
          <div className="row">
            <div className="col ">
              <div className="textHeader" style={{ textAlign: "left" }}>
                <img
                  className="play"
                  src={require("../images/person.png")}
                  alt=""
                ></img>
                {this.state.name}
              </div>
            </div>
            <br />
            <div className="col">
              <div className="textHeader" style={{ textAlign: "right" }}>
                FAST FINGERS
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="textHeader" style={{ textAlign: "left" }}>
                <img
                  className="play"
                  src={require("../images/gamepad.png")}
                  alt=""
                ></img>{" "}
                LEVEL: {this.state.difficulty}
              </div>
            </div>
            <br />
          </div>
          <br></br>
          <br></br>
          <div className="stopGame">
            <h1>GAME OVER!</h1>
            <br></br>
            <h1>{`YOUR SCORE ${this.state.currentScore}`}</h1>
            {this.state.bestScoreFlag ? <h2>New High Score!</h2> : ""}
            <br></br>
            <button className="start-game" onClick={this.onPlayAgain}>
              <img
                className="play"
                src={require("../images/reload.png")}
                alt=""
              ></img>
              Play Again
            </button>
          </div>
        </div>
      );
    }
    if (this.state.startTimeFlag) {
      counterComponent = (
        <CountDownTimer
          timeForWord={this.state.timeForWord}
          onGameOver={this.onGameOver}
          word={this.state.currentWord}
          setScore={this.setScore}
        />
      );
    }
    if (this.state.startGameFlag === true) {
      return (
        <React.Fragment>
          <div>
            <div>
              <div className="row">
                <div className="col ">
                  <div className="textHeader" style={{ textAlign: "left" }}>
                    <img
                      className="play"
                      src={require("../images/person.png")}
                      alt=""
                    ></img>
                    {this.state.name}
                  </div>
                </div>
                <br />
                <div className="col">
                  <div className="textHeader" style={{ textAlign: "right" }}>
                    FAST FINGERS
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="textHeader" style={{ textAlign: "left" }}>
                    <img
                      className="play"
                      src={require("../images/gamepad.png")}
                      alt=""
                    ></img>
                    LEVEL: {this.state.difficulty}
                  </div>
                </div>
                <br />
                <div className="col">
                  <div className="textHeader" style={{ textAlign: "right" }}>
                    Score : {this.state.currentScore}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <div className="text-center">
                  <div className="scores-box">
                    <h3 className="text">Scores</h3>
                    {this.getScoreList()}
                  </div>
                </div>
                <div className="col">
                  <button className="start-game" onClick={this.onStop}>
                    <img
                      className="play"
                      src={require("../images/cross.png")}
                      alt=""
                    ></img>
                    Stop Game
                  </button>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="div-timer text-center">
                  <div className="timer">{counterComponent}</div>
                  <br></br>
                  {this.checkCurrentWord()}
                  <br></br>
                  <input
                    value={this.state.userInput}
                    onChange={this.onUserInput}
                    className="input-box"
                    autoFocus
                  ></input>
                  <br></br>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="positionSet">
            <img
              src={require("../images/keyboard.png")}
              alt=""
              className="keyboard"
            ></img>
            <br></br>
            <div className="text">
              <div>
                <h1>FAST FINGER</h1>
              </div>
              <input
                type="text"
                value={this.state.name}
                onChange={this.addName}
                required
                className="input-box"
              />
              <div className="input-error">{this.state.nameError}</div>
              <br></br>
              <select
                selected="Easy"
                onChange={this.selectDifficulty}
                className="input-box"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <br></br>
              <button className="start-game" onClick={this.saveValue}>
                <img
                  className="play"
                  src={require("../images/play.png")}
                  alt=""
                />
                Start Game
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default startScreen;
