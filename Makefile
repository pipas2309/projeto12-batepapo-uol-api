# Cores
YELLOW = \033[1;33m
GREEN = \033[1;32m
RED = \033[1;31m
BLUE = \033[1;34m
MAGENTA = \033[1;35m
RESET = \033[0m

# Exibe todos os comandos disponíveis e suas descrições
help h:
	@echo "\n$(MAGENTA)- - - Comandos disponíveis no Makefile - - -$(RESET)\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)make %s$(RESET) - $(GREEN)%s$(RESET)\n\n", toupper($$1), $$2}'

# Comandos do Makefile

start: ## Inicia o serviço do MongoDB
	@echo "\n$(YELLOW)Iniciando o MongoDB...$(RESET)"
	sudo systemctl start mongod

status: ## Verifica o status do MongoDB e exibe um resumo
	@echo "\n$(BLUE)Verificando o status do banco de dados MongoDB...\n$(RESET)"
	@status_output=$$(sudo systemctl status mongod); \
	echo "$$status_output"; \
	if echo "$$status_output" | grep -q "Active: active (running)"; then \
		echo "\n$(GREEN)Resumo: MongoDB está em execução$(RESET)\n"; \
	elif echo "$$status_output" | grep -q "Active: inactive (dead)"; then \
		echo "\n$(RED)Resumo: MongoDB está parado$(RESET)\n"; \
	else \
		echo "\n$(YELLOW)Resumo: Status desconhecido$(RESET)\n"; \
	fi

open: ## Abre o MongoDB no navegador em localhost:27017
	@echo "\n$(BLUE)Abrindo MongoDB no navegador em localhost:27017...$(RESET)"
	xdg-open http://localhost:27017

stop: ## Para o serviço do MongoDB
	@echo "\n$(YELLOW)Encerrando o MongoDB...$(RESET)"
	sudo systemctl stop mongod
