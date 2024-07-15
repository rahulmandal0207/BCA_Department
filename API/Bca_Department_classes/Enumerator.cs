using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bca_Department_classes
{
    public enum Gender
    {
        Male = 1,
        Female = 2,
        Other = 3
    }

    public enum StaffType
    {
        SuperAdmin = 1,
        Admin = 2,
        Principal = 3,
        TeachingStaff = 4,
        NonTeachingStaff = 5
    }

    public enum Status
    {
        Active = 1,
        Inactive = 2
    }

    public enum LoginResult
    {
        Error = 1,
        WrongUserName = 2,
        AccountNotActive = 3,
        WrongPassword = 4,
        Successful = 5
    }

    public enum Category
    {

        General = 1,
        OBC = 2,
        SC = 3,
        ST = 4,
        Other = 5
    }

    public enum BloodGroup
    {
        OPositive = 1,
        ONegative = 2,
        APositive = 3,
        ANegative = 4,
        BPositive = 5,
        BNegative = 6,
        ABPositive = 7,
        ABNegative = 8,
    }


    public enum Nationality
    {
        Indian = 1,
        Other = 2
    }

    public enum Religion
    {
        Hinduism = 1,
        Islam = 2,
        Christianity = 3,
        Sikhism = 4,
        Buddhism = 5,
        Jainism = 6,
        Tribal = 7,
        Other = 8
    }

}
