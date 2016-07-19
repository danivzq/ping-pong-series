package com.stratio.main;

import com.stratio.model.Detail;
import com.stratio.model.Game;
import com.stratio.model.Game.MatchTypeEnum;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Stratio on 27/08/15.
 */
public class GamesMain {


    private static final java.lang.String TYPE_NAME = "game";

    public static void main(String[] args){
        System.out.println("*** PING_PONG_SERIES ***");

        try {
            String filePath = args[0];
            processFile(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void processFile(String filePath) throws IOException {
        FileReader fr = new FileReader(filePath);
        BufferedReader bf = new BufferedReader(fr);

        List<Game> games = new ArrayList<Game>();
        String line;
        while((line = bf.readLine()) != null){
            games.add(parseLineToGame(line));
            if(games.size() == 1000){
                Indexer.indexData(TYPE_NAME, games, Game.class);
                games = new ArrayList<Game>();
            }
        }
        Indexer.indexData(TYPE_NAME, games, Game.class);

        bf.close();
    }

    private static Game parseLineToGame(String line) {
        String[] fieldValues = StringUtils.split(line, ";");
        Game game = new Game();
        game.setMatchType(MatchTypeEnum.getMatchType(fieldValues[0]));
        game.setGameType(fieldValues[1]);
        game.setDate(fieldValues[2]);
        game.setWinner(fieldValues[3]);
        game.setWinnerNotAnalyzed(fieldValues[3]);
        List<Detail> details = new ArrayList<Detail>();
        details.add(buildPlayerDetail(fieldValues[4], fieldValues[5], fieldValues[6]));
        details.add(buildPlayerDetail(fieldValues[7], fieldValues[8], fieldValues[9]));
        game.setDetails(details);
        game.setStatus(Game.StatusTypeEnum.CONFIRMED);
        return game;
    }

    private static Detail buildPlayerDetail(String player, String wonSets, String points) {
        Detail playerDetail = new Detail();
        playerDetail.setPlayer(player);
        playerDetail.setPlayerNotAnalyzed(player);
        playerDetail.setWonSets(Integer.parseInt(wonSets));
        String[] splitPoints = StringUtils.split(points, ",");
        Integer[] intPoints = new Integer[splitPoints.length];
        Integer totalPoints = 0;
        for(int i=0; i<splitPoints.length; i++){
            intPoints[i] = Integer.parseInt(splitPoints[i]);
            totalPoints += intPoints[i];
        }
        playerDetail.setPoints(intPoints);
        playerDetail.setTotalPoints(totalPoints);
        return playerDetail;
    }

}
