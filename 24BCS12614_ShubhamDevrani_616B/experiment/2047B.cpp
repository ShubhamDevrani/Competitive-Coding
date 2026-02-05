#include<iostream>
#include<vector>
#include<math.h>
#include<bits/stdc++.h>
using namespace std;

//right submission

int main() {
    int t;
    cin >> t;

    while (t--) {
        int n;
        cin >> n;

        string s;
        cin >> s;

        int freq[26] = {0};

        for (int i = 0; i < n; i++) {
            freq[s[i] - 'a']++;
        }
 int maxChar = 0;
        for (int i = 1; i < 26; i++) {
            if (freq[i] > freq[maxChar]) {
                maxChar = i;
            }
        }
        int minChar = -1;
    for (int i = 0; i < 26; i++) {
            if (freq[i] > 0 && i != maxChar) {
                if (minChar == -1 || freq[i] < freq[minChar]) {
                    minChar = i;
                }
            }
        }

        if (minChar == -1) {
            cout << s << endl;
            continue;
        }

        for (int i = 0; i < n; i++) {
            if (s[i] - 'a' == minChar) {
                s[i] = char(maxChar + 'a');
                break;
            }
        }

        cout << s << endl;
    }

    return 0;
}

// // wrong submission
// bool prime(int n) {
//     if (n <= 1) return false;
//     for(int i=2; i<=sqrt(n); i++) {
//         if(n%i==0) {
//             return false;
//         }
//     }
//     return true;
// }

// int main() {
//     int n;
//     cin >> n;
//     vector<vector<int>> ans;

//     for(int i=0; i<n; i++) {
//         int a;
//         cin >> a;
//         vector<int> nums;

//         for(int i=1; i<=a; i++) {
//             nums.push_back(i);
//         }

//         int st = 0;
//         while(st<nums.size()-1) {
//             if(prime(nums[st] + nums[st++]) ) {
//                 next_permutation(nums.begin(), nums.end());
//             }else {
//                 continue;
//             }
//         }
//         next_permutation(nums.begin(), nums.end());

        
//         if(flag) {
//             ans.push_back(nums);
//         }


//     }
// }