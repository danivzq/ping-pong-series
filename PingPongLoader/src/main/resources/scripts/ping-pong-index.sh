#!/bin/sh
#
#  Script para creacion del indice ping-pong-series.
#   
#  Como parámetro se pasa el host y el puesto de la máquina de elasticsearch (p.e. 'localhost:9200')

curl -XDELETE  "http://$1/ping-pong-series"
echo 
curl -XPOST  "http://$1/ping-pong-series" -d '{
	"settings" : {
		"number_of_replicas" : 1,
		"number_of_shards" : 1
	},
	"mappings" : {
		"game" : {
			"dynamic" : "strict",
			"_all": {
				"enabled": false
			},
			"properties" : {
				"date" : {
					"type" : "date",
					"format" : "YYYY-MM-dd"
				},
				"matchType" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"gameType" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"winner" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"details" : {
					"type" : "nested",
					"properties" : {
						"player" : {
							"type" : "string",
							"index" : "not_analyzed"
						},
						"wonSets" : {
							"type" : "integer"
						},
						"points" : {
							"type" : "integer"
						},
						"totalPoints" : {
							"type" : "integer"
						}
					}
				}
			}
		},
		"user" : {
			"dynamic" : "strict",
			"_all": {
				"enabled": false
			},
			"properties" : {
				"username" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"password" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"fullname" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"email" : {
					"type" : "string",
					"index" : "not_analyzed"
				}
			}
		}
	}
}'
echo
