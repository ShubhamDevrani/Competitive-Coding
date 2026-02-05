#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin>>t;

    while(t--){
        int n;
        cin>>n;

        if(n<=3) {
            cout << -1 << '\n';
            continue;
        }

        vector<int> ans;
        for (int i=1; i<=n; i+=2)
            ans.push_back(i);

        for (int i=2; i<=n; i+=2)
            ans.push_back(i);

        swap(ans[0], ans[1]);

        for (int i : ans)
            cout << i << " ";
        cout << '\n';
    }

    return 0;
}
