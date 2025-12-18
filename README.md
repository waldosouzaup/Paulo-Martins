Análise de Atrasos de Entregas da Amazon
1. Problema de Negócio
A empresa enfrenta um aumento no número de entregas realizadas fora do prazo, o que tem gerado insatisfação dos clientes, aumento de reclamações e risco de perda de confiança na marca.
O principal desafio do negócio é entender por que os atrasos acontecem, identificar onde eles se concentram e gerar informações claras que apoiem decisões operacionais para reduzir a taxa de atraso e melhorar a previsibilidade das entregas.
2. Contexto
A operação de entregas envolve diferentes variáveis que impactam diretamente o prazo, como:
●	condições climáticas,
●	tráfego,
●	tipo de veículo utilizado,
●	área de entrega,
●	perfil do entregador,
●	categoria do produto.
A empresa já possui os dados operacionais registrados em uma base histórica, mas não utiliza essas informações de forma analítica para apoiar decisões estratégicas.
O objetivo deste projeto é transformar dados brutos de entregas em insights acionáveis, utilizando análises descritivas e visualizações simples, capazes de serem compreendidas por áreas como Operações, Logística e Gestão.
3. Premissas da análise
Para a realização da análise, foram adotadas as seguintes premissas:
●	O status de entrega (Delivery_Status) é considerado a fonte oficial para identificar atrasos (delay) e entregas no prazo (ontime).
●	O tempo de entrega (Delivery_Time) está representado em minutos.
●	Registros com valores ausentes em colunas como tráfego ou clima foram tratados como “informação desconhecida” ou excluídos quando necessário.
●	As análises foram feitas com foco em identificação de padrões, não em causalidade estatística.
●	O período analisado representa uma amostra válida do comportamento operacional recente da empresa.
4. Estratégia da solução
A estratégia adotada seguiu uma abordagem estruturada de análise de dados:
1.	Entendimento do problema de negócio
 Identificar claramente o que significa atraso e por que ele é prejudicial para a empresa.

2.	Exploração e organização dos dados
 Compreensão das colunas, tipos de dados e possíveis inconsistências.

3.	Análise descritiva
 Cálculo de métricas como quantidade de entregas, taxa de atraso e estatísticas de tempo de entrega.

4.	Segmentação dos atrasos
 Avaliação dos atrasos por diferentes dimensões:
○	tempo,
○	área,
○	clima,
○	tráfego,
○	veículo,
○	categoria de produto.

5.	Visualização dos dados
 Criação de gráficos claros para facilitar a interpretação dos resultados e comunicação com o negócio.
5. Insights da Análise
A análise dos dados permitiu identificar padrões relevantes, como:
●	O tempo médio de entrega é de 125 min (2h) com desvio-padrão de 52 min (2h). A entrega mais rápida aconteceu em 10 min e a mais lenta em 270 min (4,5h).
●	A área “Semi-Urban” é a única área que apresenta mais atrasos do que entregas sem atraso. 
●	Os atrasos aumentam em dias nublados e com neblina, e diminuem em dias de sol.
●	Veículos como motocicletas apresentam maior taxa de entrega atrasada em relação aos outros meios de transporte.
●	O nível de tráfego forte ( Jam ), apresenta mais atrasos.
●	Os maiores atrasos aconteceram com entregas para a área “Semi-Urban” realizadas por motocicletas como veículo.
●	Entregadores com idade acima dos 30 anos tendem a atrasar mais as entregas do que entregadores abaixo dos 30.
●	As entregas estão distribuídas uniformemente entre as categorias, exceto a categoria outros que representa 43% das entregas.
●	A menor avaliação acontece com entregas na área “Semi-Urbam” com o veículo motocicleta que também apresenta maior volume de atrasos.
Esses insights mostram que o atraso não é aleatório, mas resultado de fatores operacionais como área e tipo de veículos para entrega.

6. Resultados
Como resultado do projeto, as iniciativas são:
●	Aprofundar o entendimento do motivo pelo qual a área “Semi-Urban” tem os maiores volumes de atraso.
●	Mudar o tipo de veículo de entrega para a área “Semi-Urban”
●	Diagnóstico visual dos pontos mais críticos da operação.
●	Base analítica para priorizar ações corretivas.
●	Relatórios e gráficos que podem ser utilizados por áreas não técnicas.
Além disso, o projeto demonstra como a análise de dados pode transformar dados operacionais em decisões práticas, mesmo utilizando técnicas simples.

7. Próximos passos
Com base nos resultados obtidos, os próximos passos recomendados são:
●	Criar planos de ação específicos para áreas, veículos e condições mais críticas.
●	Monitorar a taxa de atraso de forma contínua por meio de dashboards.
●	Avaliar treinamentos ou ajustes operacionais para entregadores e rotas.
●	Integrar análises preditivas para antecipar riscos de atraso.
●	Aprofundar a análise com dados adicionais, como distância percorrida ou horário de pico.
Este projeto serve como primeiro passo para uma cultura orientada a dados, onde decisões operacionais passam a ser guiadas por evidências e não apenas por percepção.
