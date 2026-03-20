#!/bin/sh
set -e

REPO="heurema/nex"
BIN="nex"
REPO_URL="https://github.com/$REPO"

main() {
  echo "Installing $BIN from $REPO_URL ..."
  echo ""

  if ! command -v cargo >/dev/null 2>&1; then
    echo "Error: cargo is required to install $BIN."
    echo "Install Rust first: https://rustup.rs"
    exit 1
  fi

  cargo install --git "$REPO_URL" --locked
  echo ""
  echo "$BIN installed successfully!"
  echo "Run 'nex --help' to get started."
}

main
