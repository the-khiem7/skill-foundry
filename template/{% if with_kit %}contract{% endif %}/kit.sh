#!/bin/sh
# Read-only kit shipped inside a skill and run by the agent in other people's
# repositories. Rules, each pinned by tests/test_kit.py:
#   - POSIX sh and POSIX awk only, so it runs under dash, BWK awk, mawk and gawk
#   - never writes a file and never touches the network
#   - prints usage and exits 2 on a missing or unknown command
# Replace `hello` with the skill's real commands and keep the rules.

usage() {
    echo "usage: sh kit.sh hello" >&2
    exit 2
}

[ $# -ge 1 ] || usage

case "$1" in
    hello)
        echo "hello"
        ;;
    *)
        usage
        ;;
esac
