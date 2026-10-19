# Camera_PFE_Rosa

## Integrantes
- Mariana Silva de Andrade
- Anna Luiza Gomes Silva

## Descrição
Aplicação web de captura de fotos feita para a atividade de Programação Front-End. A câmera do dispositivo é exibida em tempo real. Ao capturar, a aplicação aplica um filtro sépia e adiciona o nome do aluno e a data/hora à própria imagem. A foto aparece no Canvas ao lado da câmera e só é baixada quando o usuário clica no botão de download.

## Recursos
- HTML5, CSS3 e JavaScript puro.
- MediaDevices API (`navigator.mediaDevices.getUserMedia`) para acessar a câmera.
- Canvas 2D (`context.filter`, `drawImage`, `fillText`) para processar a imagem.
- `stream.getTracks()` e `track.stop()` para liberar a câmera.
- Alternância entre tema rosa claro e tema escuro suave.
- Mensagens de orientação para erros de permissão e câmera indisponível.
- Download manual da imagem processada em PNG.

## Como executar
1. Abra a pasta no Visual Studio Code.
2. Execute `index.html` usando a extensão Live Server.
3. Permita o acesso à câmera.
4. Digite o nome do aluno e clique em **Capturar foto**.
5. A imagem processada aparecerá no painel **Sua foto**.
6. Clique em **Baixar foto em PNG** apenas se quiser salvar no computador.

> O acesso à câmera normalmente exige HTTPS ou localhost. A aplicação não salva a foto automaticamente: ela fica exibida no Canvas até a página ser recarregada ou fechada.

## Arquivos
- `index.html`
- `style.css`
- `script.js`
- `README.md`
