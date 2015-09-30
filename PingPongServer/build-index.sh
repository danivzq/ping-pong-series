#!/bin/sh
#
#  Script para creacion del indice ping-pong-series.
#   
#  Como parámetro se pasa el host y el puesto de la máquina de elasticsearch (p.e. 'localhost:9200')

curl -XDELETE  "http://$1/ping-pong-series"
echo 
curl -XPOST  "http://$1/ping-pong-series" -d '{
	"settings" : {
		"number_of_replicas" : 0,
		"number_of_shards" : 1,
		"analysis" : {
			"analyzer" : {
				"standard" : {
					"type": "standard"
				}
			}
		}
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
					"analyzer" : "standard"
				},
				"winnerNotAnalyzed" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"details" : {
					"type" : "nested",
					"properties" : {
						"player" : {
							"type" : "string",
							"analyzer" : "standard"
						},
						"playerNotAnalyzed" : {
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
				},
				"status" : {
					"type" : "string",
					"index" : "not_analyzed"
				},
				"pendingBy" : {
					"type" : "string",
					"index" : "not_analyzed"
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
