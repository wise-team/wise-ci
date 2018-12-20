#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.." # parent dir
set -e # fail on first error
set -x
cd "${DIR}"


## Warning ! This script assumes that all wise related repositories (including wise-ci)
## lie in the same root directory

WISE_CI_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

function preprocessRepository()
{
    echo "Begin preprocess"
    REPO_DIR="$1"
    REPO_BRANCH=$(git -C "${REPO_DIR}" rev-parse --abbrev-ref HEAD)
    echo "${REPO_DIR} preprocessing branch ${REPO_BRANCH}"

    git stash

    { # try
        git checkout ${REPO_BRANCH}
        npm run preprocess-wise -- "${REPO_DIR}"
    } || { # catch
        echo "There were errors. wise-ci stash will be restored"
    }
    # finally
    git checkout ${WISE_CI_BRANCH}
    git stash apply
}

ROOT_DIR="${DIR}/.."

preprocessRepository "${ROOT_DIR}/ansible-playbooks"
preprocessRepository "${ROOT_DIR}/media-kit"
# preprocessRepository "${ROOT_DIR}/steem-diff"
preprocessRepository "${ROOT_DIR}/media-kit"
preprocessRepository "${ROOT_DIR}/steem-wise-cli"
preprocessRepository "${ROOT_DIR}/steem-wise-core"
preprocessRepository "${ROOT_DIR}/steem-wise-manual"
preprocessRepository "${ROOT_DIR}/steem-wise-sql"
preprocessRepository "${ROOT_DIR}/steem-wise-test"
preprocessRepository "${ROOT_DIR}/steem-wise-voter-page"
preprocessRepository "${ROOT_DIR}/types-for-steem-js"
# preprocessRepository "${ROOT_DIR}/wise-caddy"
# preprocessRepository "${ROOT_DIR}/wise-ci"
preprocessRepository "${ROOT_DIR}/wise-hub"
preprocessRepository "${ROOT_DIR}/wise-proxy"
# preprocessRepository "${ROOT_DIR}/wise-steemd-gateway"
preprocessRepository "${ROOT_DIR}/wise-vault"
