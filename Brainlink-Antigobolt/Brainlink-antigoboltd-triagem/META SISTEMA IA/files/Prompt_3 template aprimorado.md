# Prompt 3: Sistema de envio de demonstração aprimorado

## Objetivo
Melhore o sistema de submissão de demos com as seguintes funcionalidades:
1. Sistema avançado de feedback com ratings e múltiplos critérios.
2. Processamento de áudio com visualização de forma de onda e análise básica.
3. Melhore o workflow de status (pendente, em análise, aprovado, rejeitado).
4. Implemente sistema de comentários em pontos específicos do áudio.
5. Adicione compartilhamento de demos aprovadas.
6. Crie métricas e estatísticas para demos.

### Detalhes de Implementação

#### 1. Sistema Avançado de Feedback com Ratings e Múltiplos Critérios
- **Descrição**: Permita que os usuários forneçam feedback detalhado com ratings e múltiplos critérios.
- **Tecnologias**: React, Redux, Supabase.
- **Passos**:
  1. Crie um componente de feedback que suporte ratings e múltiplos critérios.
  2. Integre o componente com o sistema de submissão de demos.
  3. Armazene os feedbacks no Supabase.

#### 2. Processamento de Áudio com Visualização de Forma de Onda e Análise Básica
- **Descrição**: Adicione visualização de forma de onda e análise básica de áudio.
- **Tecnologias**: Wavesurfer.js, React, Supabase.
- **Passos**:
  1. Integre Wavesurfer.js para visualizar a forma de onda do áudio.
  2. Adicione funcionalidades de análise básica (ex.: volume, frequência).
  3. Salve os dados de análise no Supabase.

#### 3. Melhore o Workflow de Status
- **Descrição**: Melhore o workflow de status das demos (pendente, em análise, aprovado, rejeitado).
- **Tecnologias**: React, Redux, Supabase.
- **Passos**:
  1. Crie estados adicionais para o workflow de status.
  2. Atualize a interface do usuário para refletir os novos estados.
  3. Salve as mudanças de status no Supabase.

#### 4. Sistema de Comentários em Pontos Específicos do Áudio
- **Descrição**: Permita que os usuários adicionem comentários em pontos específicos do áudio.
- **Tecnologias**: React, Redux, Supabase, Wavesurfer.js.
- **Passos**:
  1. Integre a funcionalidade de comentários em pontos específicos usando Wavesurfer.js.
  2. Armazene os comentários e os pontos associados no Supabase.
  3. Atualize a interface do usuário para mostrar os comentários no tempo correto.

#### 5. Compartilhamento de Demos Aprovadas
- **Descrição**: Adicione a funcionalidade de compartilhamento para demos aprovadas.
- **Tecnologias**: React, Supabase.
- **Passos**:
  1. Crie uma opção de compartilhamento para demos aprovadas.
  2. Gere links de compartilhamento únicos.
  3. Permita que os usuários compartilhem suas demos via redes sociais e outros meios.

#### 6. Métricas e Estatísticas para Demos
- **Descrição**: Crie métricas e estatísticas detalhadas para demos.
- **Tecnologias**: React, Recharts, Supabase.
- **Passos**:
  1. Colete dados relevantes (ex.: número de visualizações, feedbacks).
  2. Use Recharts para criar visualizações gráficas das métricas.
  3. Exiba as métricas na interface do usuário.

### Atualização do README.md
Após a implementação, atualize o arquivo README.md para refletir as melhorias no sistema de submissão de demos.

## Getting Started
```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Para documentação detalhada, visite [docs.jestfly.com](https://docs.jestfly.com).

### Conclusão
Siga os passos detalhados neste guia para implementar as melhorias no sistema de submissão de demos. Cada passo inclui ferramentas específicas e instruções detalhadas para garantir um processo de desenvolvimento suave e eficiente.