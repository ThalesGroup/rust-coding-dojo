#!/usr/bin/env bash
set -euo pipefail

errors=0
for sol_dir in katas/*/*/solutions; do
    if [ ! -d "$sol_dir" ]; then continue; fi
    kata=$(basename "$(dirname "$sol_dir")")
    pkg=$(basename "$(dirname "$(dirname "$sol_dir")")")
    tmp_dir=$(mktemp -d)
    mkdir -p "$tmp_dir/src"
    cp "$sol_dir"/*.rs "$tmp_dir/src/"
    cat > "$tmp_dir/Cargo.toml" <<EOF
[package]
name = "${pkg}-${kata}"
version = "0.1.0"
edition = "2021"
EOF
    echo "::group::Building ${pkg}/${kata} solution"
    if cargo build --manifest-path "$tmp_dir/Cargo.toml" 2>&1; then
        echo "✓ ${pkg}/${kata}"
    else
        echo "✗ ${pkg}/${kata} FAILED"
        ((errors++))
    fi
    echo "::endgroup::"
    rm -rf "$tmp_dir"
done
exit $errors
