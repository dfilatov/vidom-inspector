SHELL_DIR="$(dirname $0)"
PACKAGE_TMP_DIR=$(mktemp -d -t vidom-inspector.XXXX)
PACKAGE_DIR=$PACKAGE_TMP_DIR/vidom-inspector

$SHELL_DIR/../../node_modules/.bin/webpack --config $SHELL_DIR/webpack.config.js

mkdir $PACKAGE_DIR
cp $SHELL_DIR/{manifest.json,main.html,panel.html} $PACKAGE_DIR
mkdir $PACKAGE_DIR/build
cp -r $SHELL_DIR/build $PACKAGE_DIR

pushd $PACKAGE_DIR
zip -r vidom-inspector.zip .
popd

mv $PACKAGE_DIR/vidom-inspector.zip $SHELL_DIR
rm -rf $PACKAGE_TMP_DIR
