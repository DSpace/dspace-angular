import subprocess
import sys
from datetime import datetime

# when next editing this script, please introduce argparse.
# do not forget, it is called in BE by .github\workflows\reusable-docker-build.yml 
# argparse must be introduced there. 
# that action also calls BE version of this script, which is different (BE: scripts/sourceversion.py).
# It must also cooperate with argparse

# the idea is, that this will be different on each branch, but could be possibly passed by argv/argparse
RELEASE_TAG_BASE='none'

if __name__ == '__main__':
    ts = datetime.now()
    # we have html tags, since this script ends up creating VERSION_D.html
    print(f"<h4>This info was generated on: <br> <strong> {ts} </strong> </h4>")

    cmd = 'git log -1 --pretty=format:"<h4>Git hash: <br><strong> %H </strong> <br> Date of commit: <br> <strong> %ai </strong></h4>"'
    subprocess.check_call(cmd, shell=True)

    # when adding argparse, this should be a bit more obvious
    link = sys.argv[1] + sys.argv[2]
    print('<br> <h4>Build run: </h4> <a href="' + link + '"> ' + link + '</a> ')

    link = "https://github.com/dataquest-dev/dspace-angular/releases/tag/" \
        + RELEASE_TAG_BASE + "-" + datetime.now().strftime('%Y.%m.') + sys.argv[2]

    print('<br> <br> <h4>Release link: </h4><a href="' + link + '"> ' + link + '</a> (if it does not work, then this is not an official release instance) ')
