package com.stratio.main;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stratio.model.Detail;
import com.stratio.model.Game;
import com.stratio.model.Game.MatchTypeEnum;
import com.stratio.model.User;

/**
 * Created by Stratio on 27/08/15.
 */
public class UsersMain {

    private static final String TYPE_NAME = "user";

    private static ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args){
        System.out.println("*** PING_PONG_SERIES ***");

        String filePath = args[0];
        try {
            processFile(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void processFile(String filePath) throws IOException {
        FileReader fr = new FileReader(filePath);
        BufferedReader bf = new BufferedReader(fr);

        List<User> users = new ArrayList<User>();
        String line;
        while((line = bf.readLine()) != null){
            users.add(mapper.readValue(line, User.class));
            if(users.size() == 1000){
                Indexer.indexData(TYPE_NAME, users, User.class);
                users = new ArrayList<User>();
            }
        }
        Indexer.indexData(TYPE_NAME, users, User.class);

        bf.close();
    }

}
