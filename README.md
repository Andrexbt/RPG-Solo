# RPG Solo

O RPG Solo é um projeto web em desenvolvimento para criação, armazenamento e uso de personagens em diferentes experiências de RPG.

O MVP atual está concentrado em Dungeons & Dragons 5E (regras de 2024) e inclui:

- criação guiada de personagens de nível 1;
- armazenamento local de personagens no navegador;
- visualização de fichas salvas;
- exportação para uma ficha PDF editável.

Site publicado: https://andrexbt.github.io/RPG-Solo/

## Tecnologias

O projeto utiliza HTML, CSS e JavaScript sem framework ou etapa de compilação.

## Estrutura principal

- `index.html`: página inicial;
- `criacao-personagem.*`: fluxo de criação;
- `ficha-personagem.*`: componente compartilhado da ficha;
- `meus-personagens.*`: listagem de personagens salvos;
- `ver-personagem.*`: visualização e exportação da ficha;
- `banco-*.js`: dados de regras usados pelo criador;
- `prototipos/`: experimentos que ainda não fazem parte do fluxo principal;
- `Imagens/`: recursos visuais;
- `Fontes/`: documentos de referência permitidos no projeto.

## Executar localmente

Como a ficha compartilhada é carregada com `fetch`, abra o projeto por um servidor local em vez de abrir os arquivos HTML diretamente.

Uma opção é usar a extensão Live Server do VS Code. Outra é executar, na raiz do projeto:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Armazenamento

Os personagens são guardados em `localStorage`. Eles permanecem apenas no navegador em que foram criados e podem ser perdidos se os dados do site forem apagados. Sincronização entre dispositivos ainda não faz parte do MVP.

## Desenvolvimento

O modo de navegação livre entre as etapas permanece ligado intencionalmente para facilitar os testes durante o desenvolvimento.

Pull requests e alterações enviadas à `main` passam por verificações de sintaxe JavaScript e HTML. As verificações apenas informam problemas; não alteram os arquivos automaticamente.

## Licenças e créditos

O código do projeto ainda não possui uma licença geral definida. A ausência de uma licença não concede permissão automática para copiar, modificar ou redistribuir o código.

O conteúdo derivado do SRD 5.2.1 segue a licença CC BY 4.0 e sua atribuição obrigatória está registrada em [CREDITS.md](CREDITS.md) e no rodapé do site.

As licenças e origens dos recursos visuais devem ser documentadas individualmente antes de qualquer distribuição que ultrapasse o uso autorizado pelos respectivos autores.
