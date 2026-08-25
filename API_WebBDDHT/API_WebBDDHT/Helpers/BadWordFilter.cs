using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace API_WebBDDHT.Helpers
{
    public static class BadWordFilter
    {
        // Danh sách các từ thô tục tiếng Việt
        private static readonly HashSet<string> _badWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "đụ", "đù", "đm", "đcm", "địt", "lồn", "cặc", "buồi", "cứt", "chó", "đĩ", "điếm", "nứng", "vcl", "vl", "vãi",
            "đéo", "đếch", "cmn", "vloz", "cc", "cl", "clgt", "súc vật", "con cặc", "cái lồn", "thằng chó", "con đĩ", "đồ lợn"
        };

        /// <summary>
        /// Hàm làm mờ các từ thô tục trong chuỗi đầu vào.
        /// Các từ thô tục sẽ được thay thế bằng chuỗi ***.
        /// </summary>
        public static string MaskBadWords(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return input;

            string result = input;
            foreach (var word in _badWords)
            {
                // Sử dụng Regex để tìm kiếm từ. 
                // (?<=^|\W) và (?=$|\W) để match ranh giới từ, hỗ trợ cả Unicode.
                string pattern = $@"(?<=^|\W){Regex.Escape(word)}(?=$|\W)";
                
                string mask = "***";

                result = Regex.Replace(result, pattern, mask, RegexOptions.IgnoreCase);
            }

            return result;
        }

        /// <summary>
        /// Hàm kiểm tra xem chuỗi đầu vào có chứa từ thô tục hay không.
        /// Trả về true nếu có từ thô tục.
        /// </summary>
        // public static bool ContainsBadWords(string input)
        // {
        //     if (string.IsNullOrWhiteSpace(input)) return false;

        //     foreach (var word in _badWords)
        //     {
        //         string pattern = $@"(?<=^|\W){Regex.Escape(word)}(?=$|\W)";
        //         if (Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase))
        //         {
        //             return true;
        //         }
        //     }

        //     return false;
        // }
    }
}
