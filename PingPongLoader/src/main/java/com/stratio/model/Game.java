package com.stratio.model;

import java.util.Date;
import java.util.List;

/**
 * Created by Stratio on 27/08/15.
 */
public class Game {

    public enum MatchTypeEnum {
        SINGLES, DOUBLES;

        public static MatchTypeEnum getMatchType(String type){
            if(MatchTypeEnum.SINGLES.name().equals(type)){
                return MatchTypeEnum.SINGLES;
            }else if(MatchTypeEnum.DOUBLES.name().equals(type)){
                return MatchTypeEnum.DOUBLES;
            }else{
                return null;
            }
        }
    }

    private MatchTypeEnum matchType;
    private String gameType;
    private String date;
    private String winner;
    private List<Detail> details;

    public MatchTypeEnum getMatchType() {
        return matchType;
    }

    public void setMatchType(MatchTypeEnum matchType) {
        this.matchType = matchType;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public List<Detail> getDetails() {
        return details;
    }

    public void setDetails(List<Detail> details) {
        this.details = details;
    }
}