# ConjugaBR — Android APK

O projeto preserva a interface React original e a consulta por IA, mas **não embute a chave do Gemini no APK**.

## 1. Criar o servidor seguro (Cloudflare Workers)

1. Crie uma conta em https://dash.cloudflare.com/ e abra **Workers & Pages**.
2. Crie um Worker, abra a edição de código, substitua pelo conteúdo de `worker/index.js` e publique.
3. Em **Settings > Variables and Secrets**, adicione um **Secret** com nome `GEMINI_API_KEY` e valor da sua chave de API. Não use variável pública.
4. Copie a URL pública do Worker (por exemplo, `https://conjugabr-api.seuusuario.workers.dev`).
5. Recomenda-se restringir o uso com limites de taxa, proteção antiabuso e cotas da API antes de divulgar publicamente: a API de exemplo é pública e poderá consumir sua cota.

## 2. Informar a URL ao GitHub

1. No repositório GitHub abra **Settings > Secrets and variables > Actions > Variables**.
2. Crie a variável de repositório **CONJUGABR_API_URL** com a URL HTTPS do Worker, sem `/conjugar`.
3. **Nunca** adicione a chave do Gemini às variáveis `VITE_` ou ao código React: tudo que chega ao aplicativo é visível ao usuário.

## 3. Compilar o APK automaticamente

1. Envie todos os arquivos deste ZIP ao repositório (incluindo a pasta oculta `.github`).
2. Acesse **Actions > Gerar APK Android > Run workflow**.
3. Após o processo terminar, abra a execução e baixe o artefato **ConjugaBR-APK**.
4. Extraia o arquivo: nele estará `app-debug.apk`, que pode ser instalado no Android para testes.

O APK debug NÃO é uma versão assinada para distribuição na Play Store. Para publicação, crie uma versão release assinada e um arquivo AAB.

## 4. Compilar localmente (opcional)

Tenha Node.js 22, Java JDK 17, Android SDK e Android Studio instalados.

```bash
npm install
# Defina VITE_CONJUGABR_API_URL no ambiente ou em .env.local
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Para atualizações futuras, depois de modificar o React execute `npm run android:sync`.

## Observações importantes

- É necessário internet para consultar verbos, pois o processamento ocorre no servidor Gemini.
- O ambiente em que este ZIP foi preparado não disponibilizou download de pacotes npm nem compilação de APK, portanto o build final precisa rodar no GitHub Actions (ou em computador com Android SDK).
- Uma chave exposta anteriormente deverá ser revogada e substituída por outra.
- O app ID é `com.olivaproducoes.conjugabr` e o nome instalado é `ConjugaBR`.
