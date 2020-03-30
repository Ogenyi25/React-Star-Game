import React, { useState, useEffect } from "react";
import utils from "../math-utils";
import StarDisplay from "./StarDisplay";
import PlayAgain from "./PlayAgain";
import PlayNumber from "./PlayNumber";

const useGameState = () => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondsLeft, setsecondsLeft] = useState(10);

    useEffect(() => {
        if (secondsLeft > 0 && availableNums.length > 0) {
            const timerId = setTimeout (() => setsecondsLeft(setsecondsLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    });

    const setGameState = (newCandidateNums) => {
        if (utils.sum(newCandidateNums) !== stars) {
            setCandidateNums(newCandidateNums);
        } else {
            const newAvailableNUms = availableNums.filter(
                n => !newCandidateNums.includes(n)
            );
            setStars(utils.randomSumIn(newAvailableNUms, 9));
            setAvailableNums(newAvailableNUms);
            setCandidateNums([]);
        }
    };

    return { stars, availableNums, candidateNums, secondsLeft, setGameState};
};

const Game = (props) => {
    const {
        stars,
        availableNums,
        candidateNums,
        secondsLeft,
        setGameState,
    } = useGameState();

    const candidatesAreWrong = utils.sum(candidateNums) > stars;
    const gameStatus = availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

    const numberStatus = (number) => {
        if (!availableNums.includes(number)) {
            return "used";
        }

        if (candidateNums.includes(number)) {
            return candidatesAreWrong ? "wrong" : "candidate";
        }

        return "available";
    };

    const onNumberClick = (number, currentStatus) => {
        if (currentStatus === "used" || secondsLeft === 0) {
            return;
        }

        const newCandidateNums = currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

        setGameState(newCandidateNums);
    };

    return (
        <div className="game">
            <div className="help">
                Pick 1 or more number that will sum up to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {gameStatus !== "active" ? (
                        <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
                    ) : (
                        <StarDisplay count={stars} />
                    )}
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number => (
                        <PlayNumber
                        key={number}
                        status={numberStatus(number)}
                        number={number}
                        onClick={onNumberClick}
                        />
                    ))}
                </div>
            </div>
            <div className="timer">Time Remaining: { secondsLeft }</div>
        </div>
    );
};

export default Game;