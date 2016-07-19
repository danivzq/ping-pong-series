package com.stratio.main;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stratio.model.User;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

/**
 * Created by Stratio on 28/08/15.
 */
public class Indexer {

    private static final String CLUSTER_NAME = "elasticsearch";
    private static final String HOST = "localhost";
    private static final Integer PORT = 9300;
    private static final String INDEX_NAME = "ping-pong-series";

    private static ObjectMapper mapper = new ObjectMapper();

    public static <T> void indexData(String typeName, List<T> docs, Class<T> clazz) throws JsonProcessingException, UnknownHostException {
        Settings settings = Settings.settingsBuilder().put("cluster.name", CLUSTER_NAME).build();
        Client client = TransportClient.builder().settings(settings).build()
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(HOST), PORT));

        BulkRequestBuilder bulkRequest = client.prepareBulk();

        if(clazz.equals(User.class)){
            for (T doc : docs) {
                bulkRequest.add(client.prepareIndex(INDEX_NAME, typeName, ((User) doc).getUsername())
                        .setSource(mapper.writeValueAsString(((User) doc))));
            }
        }else {
            for (T doc : docs) {
                bulkRequest.add(client.prepareIndex(INDEX_NAME, typeName).setSource(mapper.writeValueAsString(doc)));
            }
        }

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            System.out.println("Error in bulk operation: " + bulkResponse.buildFailureMessage());
        }
    }

}
