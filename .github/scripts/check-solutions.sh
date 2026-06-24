#!/usr/bin/env bash
set -euo pipefail

errors=0
count=0

is_excluded_solution() {
    case "$1" in
        "01-starter/00-rustward-sword"|"01-starter/03-ownership-borrowing"|"02-structure/01-smart-pointers")
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

for sol_dir in katas/*/*/solutions; do
    if [ ! -d "$sol_dir" ]; then continue; fi
    kata=$(basename "$(dirname "$sol_dir")")
    pkg=$(basename "$(dirname "$(dirname "$sol_dir")")")
    kata_id="${pkg}/${kata}"

    if is_excluded_solution "$kata_id"; then
        echo "::warning::Skipping ${kata_id}: excluded from solution CI"
        continue
    fi

    if [ ! -f "$sol_dir/main.rs" ]; then
        echo "::warning::Skipping ${kata_id}: missing solutions/main.rs"
        continue
    fi

    count=$((count + 1))
    crate_name="kata-solution-${count}"
    tmp_dir=$(mktemp -d)
    mkdir -p "$tmp_dir/src"
    if ! compgen -G "$sol_dir/*.rs" >/dev/null; then
        echo "::warning::Skipping ${kata_id}: no .rs files found"
        rm -rf "$tmp_dir"
        continue
    fi
    cp "$sol_dir"/*.rs "$tmp_dir/src/"
    cat > "$tmp_dir/Cargo.toml" <<EOF
[package]
name = "${crate_name}"
version = "0.1.0"
edition = "2021"
EOF
    echo "::group::Building ${kata_id} solution"
    if cargo build --manifest-path "$tmp_dir/Cargo.toml" 2>&1; then
        echo "✓ ${kata_id}"
    else
        echo "✗ ${kata_id} FAILED"
        errors=$((errors + 1))
    fi
    echo "::endgroup::"
    rm -rf "$tmp_dir"
done
exit $errors
