const Contact: React.FC = () => {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-center text-slate-900 mb-6">
        Contact Us
      </h2>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1">
              Call Us
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              090-456-606-63
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1">
              Email Us
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-900 break-all">
              customercare@icmaservices.com
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1">
              Open Hours
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              Mon - Fri | 9:00AM - 05:00PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
