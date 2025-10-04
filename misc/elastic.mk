.PHONY: elastic-create-kibana-user
elastic-create-kibana-user:
	docker compose exec elasticsearch curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
		-H "Content-Type: application/json" \
		-u "elastic:${ELASTIC_PASSWORD}" \
		-d '{"password":"${KIBANA_PASSWORD}"}'

.PHONY: elastic-create-metricbeat-user
elastic-create-metricbeat-user:
	docker compose exec elasticsearch curl -X POST "http://localhost:9200/_security/user/metricbeat" \
		-H "Content-Type: application/json" \
		-u "elastic:${ELASTIC_PASSWORD}" \
		-d '{"password":"${METRICBEAT_PASSWORD}","roles":["metricbeat_writer","metricbeat_reader"]}'
