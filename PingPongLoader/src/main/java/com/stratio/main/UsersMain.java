package com.stratio.main;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stratio.model.User;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Stratio on 27/08/15.
 */
public class UsersMain {

    private static final String TYPE_NAME = "user";

    private static ObjectMapper mapper = new ObjectMapper();

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
