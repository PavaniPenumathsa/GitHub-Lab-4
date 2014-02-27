using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace WcfService1
{

    public class Person
    {
        public string SaleAd { get; set; }
        //public string Name { get; set; }
    }

    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public class Service1 : IService1
    {
        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        [WebInvoke(Method = "GET",ResponseFormat = WebMessageFormat.Json,UriTemplate = "data/{SaleAd}")]
        public Person GetData2(string SaleAd)
        {
            return new Person()
                {
                    SaleAd = "Sale in Walmart " + SaleAd + "% OFF"

                    //Name = "Student" + id
                };
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }
    }
}
