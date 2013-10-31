#
# wharfie server create failoh -m 512
#
# fails at creating a server because of inadequate credentials (none stored)
# server image defaults to 512
#
../bin/wharfie server create failoh -m 512

#
# wharfie provider add digitalocean clientid clientapikey
#
# adds digital ocean credentials so we can start servers
#

#
# wharfie provider list
#

#
# wharfie server create unicornserver --myKey ~/.ssh/id_rsa.pub --deployKey ~/.ssh/github_deploy.pub --domain dinospaceships.com
#
# 1. creates a server in provider
# 2. installs docker
# 3. installs dokku
#
# optional:
#
# 4. adds your public key to the server
# 5. adds a deploy key
# 6. sets the domain in dokku
#
# future:
#
# would be cool to support notion of stacks, so that people can create their own since hooks are
# dangerous, cause people can run commands with and without resulting in inconsistent environments
#
# tells people to set their A dns record
#

#
# wharfie server use unicornserver
#
# the default server in use is now the unicorn server
#
# should always should current use provider and server if any
# 

#
# wharfie server list
#
# should check if manifest matches online
#

#
# wharfie containers list
#
# lists all containers
#

#
# wharfie docker run ...
#

#
# wharfie dokku
#

#
# shared configs
#