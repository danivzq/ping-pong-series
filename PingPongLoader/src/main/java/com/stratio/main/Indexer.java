package com.stratio.main;

import java.util.List;

import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stratio.model.User;

/**
 * Created by Stratio on 28/08/15.
 */
public class Indexer {

    private static final String CLUSTER_NAME = "division-empresas";
    private static final String INDEX_NAME = "ping-pong-series";

    private static ObjectMapper mapper = new ObjectMapper();

    public static <T> void indexData(String typeName, List<T> docs, Class<T> clazz) throws JsonProcessingException {
        Settings settings = ImmutableSettings.settingsBuilder().put("cluster.name", CLUSTER_NAME).build();
        Client client = new TransportClient(settings)
                .addTransportAddress(new InetSocketTransportAddress("localhost", 9300));

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
