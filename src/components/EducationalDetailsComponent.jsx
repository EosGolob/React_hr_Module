import React from "react";

const EducationalDetailsComponent = ({ formData, errors, handleChange }) => {
  return (
    <div className="container">
      <br></br>
      <div className="row">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          <div className="card-body">
            <h2  className="text-center">EDUCATIONAL DETAILS</h2>
            <form>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  placeholder="Enter qualification"
                  className={`form-control ${
                    errors.qualification ? "is-invalid" : ""
                  }`}
                  value={formData.qualification}
                  onChange={(e) =>
                    handleChange("qualification", e.target.value)
                  }
                />
                {errors.qualification && (
                  <div className="invalid-feedback">{errors.qualification}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Previous Organisation</label>
                <input
                  type="text"
                  placeholder="Enter Previous Organisation"
                  className={`form-control ${
                    errors.previousOrganisation ? "is-invalid" : ""
                  }`}
                  value={formData.previousOrganisation}
                  onChange={(e) =>
                    handleChange("previousOrganisation", e.target.value)
                  }
                />
                {errors.previousOrganisation && (
                  <div className="invalid-feedback">
                    {errors.previousOrganisation}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Languages</label>
                <input
                  type="text"
                  placeholder="Enter languages"
                  className={`form-control ${
                    errors.languages ? "is-invalid" : ""
                  }`}
                  value={formData.languages}
                  onChange={(e) => handleChange("languages", e.target.value)}
                />
                {errors.languages && (
                  <div className="invalid-feedback">{errors.languages}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Total Experience</label>
                <input
                  type="text"
                  placeholder="Enter Total Experience"
                  className={`form-control ${
                    errors.experience ? "is-invalid" : ""
                  }`}
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                />
                {errors.experience && (
                  <div className="invalid-feedback">{errors.experience}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalDetailsComponent;
