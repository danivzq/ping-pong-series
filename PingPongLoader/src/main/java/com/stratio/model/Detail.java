package com.stratio.model;

/**
 * Created by Stratio on 27/08/15.
 */
public class Detail {

    private String player;
    private String playerNotAnalyzed;
    private Integer wonSets;
    private Integer[] points;
    private Integer totalPoints;

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getPlayerNotAnalyzed() {
        return playerNotAnalyzed;
    }

    public void setPlayerNotAnalyzed(String playerNotAnalyzed) {
        this.playerNotAnalyzed = playerNotAnalyzed;
    }

    public Integer getWonSets() {
        return wonSets;
    }

    public void setWonSets(Integer wonSets) {
        this.wonSets = wonSets;
    }

    public Integer[] getPoints() {
        return points;
    }

    public void setPoints(Integer[] points) {
        this.points = points;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }
}
