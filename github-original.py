
import sys
import json
import requests


url_base = 'https://api.github.com'

token = '30151d9b304a70704c20bf735dbf9f668d55545d'


def main():
    if len(sys.argv) < 3:
        return

    repo = sys.argv[1]
    action = sys.argv[2]
    user = 'Teradata'

    if len(sys.argv) > 3:
        user = sys.argv[3]
           
    if action == 'pull_requests':
        pull_requests(repo, user)
    elif action == 'open_pull_requests':
        open_pull_requests(repo, user)
        
    
def make_request(url):
    headers = {'Authorization':'token %s' % token}
    params = {'state': 'all', 'per_page': 100}
    resp = requests.get(url, headers=headers, params=params)
    return resp

def pull_requests(repo, user_arg):
    
    num_pr = 0
    num_open = 0
    num_closed = 0

    num_pr_td = 0
    num_open_td = 0
    num_closed_td = 0
    
    num_comments = 0
    num_commits = 0
    num_additions = 0
    num_deletions = 0
    num_changed_files = 0

    url = url_base + '/repos/' + repo + '/pulls'
    while url is not None:
   
        print url
        resp = make_request(url)
        data = json.loads(resp.text)
        print data
        num_pr += len(data)

        for pullr in data:
            
            # for deleted users
            if pullr == None or pullr['head'] == None or pullr['head']['user'] == None:
                continue;
            
            if 'head' in pullr and 'user' in pullr['head'] and 'login' in pullr['head']['user']:
                user = pullr['head']['user']['login'] 
                
            if pullr['state'] == 'closed':
                num_closed += 1
            elif pullr['state'] == 'open':
                num_open += 1

       
            if user == user_arg or user_arg == 'ANY':
                num_pr_td += 1
                
                if pullr['state'] == 'closed':
                    num_closed_td += 1
                elif pullr['state'] == 'open':
                    num_open_td += 1

                print '{}|{}|{}|{}|{}|{}|{}|{}|{}|{}'.format(pullr['id'],
                                                       pullr['number'],
                                                       pullr['head']['label'],
                                                       pullr['state'],
                                                       pullr['user']['login'],
                                                       pullr['created_at'],
                                                       pullr['updated_at'],
                                                       pullr['closed_at'],
                                                       pullr['merged_at'],
                                                       pullr['html_url'])
                
                pr_resp = make_request(pullr['url'])
                pr_data = json.loads(pr_resp.text)
                num_comments += pr_data['comments']
                num_comments += pr_data['review_comments']
                num_commits += pr_data['commits']
                num_additions += pr_data['additions']
                num_deletions += pr_data['deletions']
                num_changed_files += pr_data['changed_files']

        if 'next' in resp.links:
            #break
            url = resp.links['next']['url']
        else:
            break

    print 'pull requests for {}:'.format(repo)
    print '   total: {}:'.format(num_pr)
    print '   num open: {}:'.format(num_open)
    print '   num closed: {}:'.format(num_closed)

    print 'pull requests for {} by {}:'.format(repo, user_arg)
    print '   total: {}:'.format(num_pr_td)
    print '   num open: {}:'.format(num_open_td)
    print '   num closed: {}:'.format(num_closed_td)

    print 'num_comments: {}'.format(num_comments)
    print 'num_commits: {}'.format(num_commits)
    print 'num_additions: {}'.format(num_additions)
    print 'num_deletions: {}'.format(num_deletions)
    print 'num_changed_files: {}'.format(num_changed_files)

def open_pull_requests(repo, user_arg):
    
    url = url_base + '/repos/' + repo + '/pulls'
    while url is not None:
        #print url
        resp = make_request(url)
        data = json.loads(resp.text)
        #num_pr += len(data)

        for pullr in data:
            
            # for deleted users
            if pullr == None or pullr['head'] == None or pullr['head']['user'] == None:
                continue;
            
            if 'head' in pullr and 'user' in pullr['head'] and 'login' in pullr['head']['user']:
                user = pullr['head']['user']['login'] 
                
            if pullr['state'] != 'open':
                continue;
       
            if user == user_arg or user_arg == 'ANY':
                #num_pr_td += 1
                
                if pullr['state'] != 'open':
                    continue

                print '{}|{}|{}|{}|{}|{}|{}|{}|{}|{}'.format(pullr['id'],
                                                       pullr['number'],
                                                       pullr['head']['label'],
                                                       pullr['state'],
                                                       pullr['user']['login'],
                                                       pullr['created_at'],
                                                       pullr['updated_at'],
                                                       pullr['closed_at'],
                                                       pullr['merged_at'],
                                                       pullr['html_url'])
                
        if 'next' in resp.links:
            #break
            url = resp.links['next']['url']
        else:
            break


if __name__ == "__main__":
    main()

