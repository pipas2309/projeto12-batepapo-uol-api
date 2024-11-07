# Configurações, Cores e Variáveis
YELLOW = \033[1;33m
GREEN  = \033[1;32m
RED    = \033[1;31m
BLUE   = \033[1;34m
MAGENTA= \033[1;35m
RESET  = \033[0m

SHELL := /bin/bash

help h:
	@echo -e "$(MAGENTA)- - - Comandos disponíveis no Makefile - - -$(RESET)"
	@awk -F ':|##' "\
		BEGIN { section = \"\" } \
		/^##@/ { \
			section = substr(\$$0, index(\$$0, \$$2)); \
			printf \"\n $(MAGENTA) %s$(RESET)\n\", section; \
			next \
		} \
		/^[a-zA-Z0-9_-]+([ ]+[a-zA-Z0-9_-]+)*:/ { \
			split(\$$1, targets, \" \"); \
			gsub(/^[ \\t]+|[ \\t]+\$$/, \"\", \$$3); \
			for (i in targets) { \
				if (targets[i] != \"help\" && targets[i] != \"h\") { \
					printf \"     $(YELLOW)make %s$(RESET) - $(GREEN)%s$(RESET)\n\", toupper(targets[i]), \$$3 \
				} \
			} \
		} \
	" $(MAKEFILE_LIST)

	@echo

##@ Comandos do MongoDB
start: ## Inicia o serviço do MongoDB
	@echo -e "\n$(YELLOW)Iniciando o MongoDB...$(RESET)"
	sudo systemctl start mongod
status: ## Verifica o status do MongoDB e exibe um resumo
	@echo -e "\n$(BLUE)Verificando o status do MongoDB...\n$(RESET)"
	@status_output=$$(sudo systemctl status mongod); \
	echo "$$status_output"; \
	if echo "$$status_output" | grep -q "Active: active (running)"; then \
		echo -e "\n$(GREEN)Resumo: MongoDB está em execução$(RESET)\n"; \
	elif echo "$$status_output" | grep -q "Active: inactive (dead)"; then \
		echo -e "\n$(RED)Resumo: MongoDB está parado$(RESET)\n"; \
	else \
		echo -e "\n$(YELLOW)Resumo: Status desconhecido$(RESET)\n"; \
	fi
stop: ## Para o serviço do MongoDB
	@echo -e "\n$(YELLOW)Encerrando o MongoDB...$(RESET)"
	sudo systemctl stop mongod

##@ Script de Atualização de Versão
# Captura o tipo de atualização a partir dos argumentos
TYPE := $(filter major minor patch,$(MAKECMDGOALS))
# Remove o argumento de TYPE dos objetivos para evitar erros
MAKECMDGOALS := $(filter-out $(TYPE),$(MAKECMDGOALS))

.PHONY: bv bump_version major minor patch

bv bump_version: ## Atualiza a versão do projeto automaticamente (major, minor ou patch) ou exibe instruções de uso
	@if [ -z "$(TYPE)" ]; then \
		echo -e "\n$(MAGENTA)Uso do comando de atualização de versão:$(RESET)"; \
		echo -e "$(YELLOW)make bv <tipo>$(RESET) - onde <tipo> pode ser 'major', 'minor' ou 'patch'."; \
		echo -e "Exemplo: $(BLUE)make bv major$(RESET) - para incrementar a versão principal."; \
		echo ""; \
		exit 0; \
	fi; \
	current_version=$$(cat VERSION); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	if [ "$(TYPE)" = "major" ]; then \
		major=$$((major + 1)); minor=0; patch=0; \
	elif [ "$(TYPE)" = "minor" ]; then \
		minor=$$((minor + 1)); patch=0; \
	elif [ "$(TYPE)" = "patch" ]; then \
		patch=$$((patch + 1)); \
	else \
		echo -e "$(RED)Erro: Tipo de atualização inválido. Use 'major', 'minor' ou 'patch'.$(RESET)"; \
		exit 1; \
	fi; \
	new_version="$$major.$$minor.$$patch"; \
	echo "$$new_version" > VERSION; \
	sed -i "s/\"version\": \".*\"/\"version\": \"$$new_version\"/" package.json; \
	sed -i "s/\"version\": \".*\"/\"version\": \"$$new_version\"/" package-lock.json; \
	sed -i "s/version: '.*'/version: '$$new_version'/" src/config/swagger.ts; \
	echo -e "$(GREEN)Versão atualizada para $$new_version$(RESET)"; \
	echo -e "\n$(YELLOW)Sugestão de commit:$(RESET)"; \
	echo -e "$(GREEN)🔖 chore: bump version to $$new_version$(RESET)"; \
	echo ""

##@ Scripts da API
run: ## Roda o projeto de forma simplificada (inicia MongoDB e npm)
	@$(MAKE) -s start
	@echo -e "$(YELLOW)Verificando se a porta 3000 está disponível...\n$(RESET)"
	@continue=0; \
	if lsof -i:3000 | grep -q LISTEN; then \
		echo -e "$(RED)Erro: A porta 3000 já está em uso. Verifique se o servidor já está rodando.$(RESET)"; \
		echo -e "$(MAGENTA)Dica: Use 'lsof -i:3000' para ver qual processo está usando a porta ou finalize o processo atual.\n$(RESET)"; \
		continue=1; \
	fi; \
	if [ $$continue -eq 0 ]; then \
		echo -e "$(YELLOW)Iniciando o servidor de desenvolvimento...$(RESET)"; \
		npm run dev || { \
			echo -e "$(RED)Erro ao iniciar o servidor de desenvolvimento. Verifique o npm.\n$(RESET)"; \
			exit 1; \
		}; \
	fi; \
