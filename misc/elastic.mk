.PHONY: elastic-create-kibana-user
elastic-create-kibana-user:
	docker compose -f apps/elastic/compose.yaml exec elasticsearch curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
		-H "Content-Type: application/json" \
		-u "elastic:${ELASTIC_PASSWORD}" \
		-d '{"password":"${KIBANA_PASSWORD}"}'
