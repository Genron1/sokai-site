# sokai-site

このリポジトリはGitHub Pagesで公開されています。

## 重要な注意事項

⚠️ **このリポジトリにpushすると、GitHub Pagesで即座に公開されます。**

本番環境への反映前に、必ずローカル環境で十分に確認してください。

## ローカルでの確認方法

HTMLファイルを直接ブラウザで開いて確認：

```bash
open index.html
```

または、簡易的なローカルサーバーを起動：

```bash
# Python 3を使用
python3 -m http.server 8000

# Node.jsのhttpサーバーを使用
npx http-server
```

ブラウザで `http://localhost:8000` にアクセスして確認してください。

## デプロイフロー

1. ローカルで変更を加える
2. ブラウザで動作確認
3. 問題がないことを確認後、commitとpush
4. GitHub Pagesに自動反映（数分かかる場合があります）

## 公開URL

設定完了後、以下のURLで公開されます：
- `https://<username>.github.io/sokai-site/`
