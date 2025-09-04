import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateEngineerProfileApi,
  UpdateEngineerProfileParams,
} from '@/services/engineerService';
import { getUserFromCookie } from '@/utils/apiHeader';
import countriesCitiesData from '@/constants/countries-cities.json';
import {
  setLocationData,
  setSalaryData,
  setWorkModeData,
  setRelocationData,
  setJoiningPeriodData,
  setInterviewSlotData,
} from '@/store/slices/engineerProfileSlice';
import { RootState } from '@/store/store';

interface FormData {
  country: string;
  city: string;
  location: string; // This will be combined "City, Country"
  monthlyCompensation: string;
  currency: string;
  workArrangement: string[];
  relocateWithinCountry: string;
  startTiming: string;
  relocateOutsideCountry: string;
  relocationConfirmed: string;
  interviewTime: string[];
}

const KnowBetterQuestions: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const engineerProfile = useSelector(
    (state: RootState) => state.engineerProfile
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    country: '',
    city: '',
    location: '',
    monthlyCompensation: '',
    currency: 'CAD',
    workArrangement: [],
    relocateWithinCountry: '',
    startTiming: '',
    relocateOutsideCountry: '',
    relocationConfirmed: '',
    interviewTime: [],
  });

  const handleNext = async () => {
    if (!canProceed()) return;

    setIsLoading(true);
    setError('');

    try {
      // Get user from cookies
      const user = getUserFromCookie();
      if (!user || !user.id) {
        throw new Error('User not found. Please login again.');
      }

      const userId = String(user.id);

      // Update Redux store based on current step
      updateReduxStore();
      // Get updated profile from Redux after the update
      const updatedProfile = { ...engineerProfile };
      // Apply the current step's changes to the profile object
      applyCurrentStepChanges(updatedProfile);
      // Create API payload using the updated Redux state
      const profileData: UpdateEngineerProfileParams = updatedProfile;
      const response = await updateEngineerProfileApi(userId, profileData);
      console.log('Profile updated successfully:', response);
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      } else {
        console.log('Form completed:', formData);
        router.push('/engineer/upload-resume');
      }
    } catch (err: unknown) {
      console.error('Error updating profile:', err);

      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message || 'Failed to update profile. Please try again.');
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateReduxStore = () => {
    switch (currentStep) {
      case 1: // Location
        if (formData.location) {
          dispatch(
            setLocationData({
              preferredLocations: [formData.location],
            })
          );
        }
        break;
      case 2: // Monthly compensation and currency
        if (formData.monthlyCompensation || formData.currency) {
          dispatch(
            setSalaryData({
              preferredMonthlySalary: formData.monthlyCompensation,
              currencyType: formData.currency,
            })
          );
        }
        break;
      case 3: // Work arrangement
        if (formData.workArrangement.length > 0) {
          dispatch(
            setWorkModeData({
              workMode: formData.workArrangement,
            })
          );
        }
        break;
      case 4: // Relocate within country
        if (formData.relocateWithinCountry) {
          dispatch(
            setRelocationData({
              isWillingToRelocate: formData.relocateWithinCountry === 'YES',
            })
          );
        }
        break;
      case 5: // Start timing
        if (formData.startTiming) {
          dispatch(
            setJoiningPeriodData({
              joiningPeriod: formData.startTiming,
            })
          );
        }
        break;
      case 6: // Relocate outside country
        if (formData.relocateOutsideCountry) {
          dispatch(
            setRelocationData({
              isOpenToOtherLocations: formData.relocateOutsideCountry === 'YES',
            })
          );
        }
        break;
      case 7: // Relocation confirmed
        if (formData.relocationConfirmed) {
          dispatch(
            setRelocationData({
              relocationConfirmed: formData.relocationConfirmed === 'YES',
            })
          );
        }
        break;
      case 8: // Interview time
        if (formData.interviewTime.length > 0) {
          dispatch(
            setInterviewSlotData({
              interviewSlot: formData.interviewTime,
            })
          );
        }
        break;
    }
  };

  const applyCurrentStepChanges = (profile: UpdateEngineerProfileParams) => {
    switch (currentStep) {
      case 1: // Location
        if (formData.location) {
          profile.preferredLocations = [formData.location];
        }
        break;
      case 2: // Monthly compensation and currency
        if (formData.monthlyCompensation) {
          profile.preferredMonthlySalary = formData.monthlyCompensation;
        }
        if (formData.currency) {
          profile.currencyType = formData.currency;
        }
        break;
      case 3: // Work arrangement
        if (formData.workArrangement.length > 0) {
          profile.workMode = formData.workArrangement;
        }
        break;
      case 4: // Relocate within country
        if (formData.relocateWithinCountry) {
          profile.isWillingToRelocate =
            formData.relocateWithinCountry === 'YES';
        }
        break;
      case 5: // Start timing
        if (formData.startTiming) {
          profile.joiningPeriod = formData.startTiming;
        }
        break;
      case 6: // Relocate outside country
        if (formData.relocateOutsideCountry) {
          profile.isOpenToOtherLocations =
            formData.relocateOutsideCountry === 'YES';
        }
        break;
      case 7: // Relocation confirmed
        if (formData.relocationConfirmed) {
          profile.relocationConfirmed = formData.relocationConfirmed === 'YES';
        }
        break;
      case 8: // Interview time
        if (formData.interviewTime.length > 0) {
          profile.interviewSlot = formData.interviewTime;
        }
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.location.trim() !== '';
      case 2:
        const salary = parseInt(formData.monthlyCompensation || '0');
        return (
          formData.monthlyCompensation.trim() !== '' &&
          salary > 0 &&
          salary <= 999
        );
      case 3:
        return formData.workArrangement.length > 0;
      case 4:
        return formData.relocateWithinCountry !== '';
      case 5:
        return formData.startTiming !== '';
      case 6:
        return formData.relocateOutsideCountry !== '';
      case 7:
        return formData.relocationConfirmed !== '';
      case 8:
        return formData.interviewTime.length > 0;
      default:
        return false;
    }
  };

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // If country changes, reset city and location
      if (field === 'country') {
        newData.city = '';
        newData.location = '';
        const selectedCountry = countriesCitiesData.countries.find(
          c => c.code === value
        );
        newData.currency = selectedCountry?.currency || 'INR';
      }
      // If city changes, update the combined location
      if (field === 'city' && value) {
        const selectedCountry = countriesCitiesData.countries.find(
          c => c.code === prev.country
        );
        newData.location = `${value}, ${selectedCountry?.name || ''}`;
      }

      return newData;
    });
    setError(''); // Clear any previous errors
  };

  const toggleArraySelection = (
    field: 'workArrangement' | 'interviewTime',
    value: string
  ) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  // Get cities for selected country
  const getAvailableCities = () => {
    const selectedCountry = countriesCitiesData.countries.find(
      country => country.code === formData.country
    );
    return selectedCountry?.cities || [];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Please provide your current location.
            </h2>
            <div className="space-y-4">
              {/* Country Dropdown */}
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={e => updateFormData('country', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                  autoFocus
                  disabled={isLoading}
                >
                  <option value="" disabled hidden>
                    Select a country
                  </option>
                  {countriesCitiesData.countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>

              {/* City Dropdown - Only show if country is selected */}
              {formData.country && (
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={e => updateFormData('city', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                    disabled={isLoading}
                  >
                    <option value="" disabled hidden>
                      Select a city
                    </option>
                    {getAvailableCities().map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                </div>
              )}

              {/* Show selected location */}
              {formData.location && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Selected: <strong>{formData.location}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Please enter your preferred monthly compensation.
            </h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={formData.monthlyCompensation}
                  onChange={e => {
                    const input = e.target as HTMLInputElement;
                    let value = input.value.replace(/[^0-9]/g, '');

                    // Since backend stores in thousands, limit input to 999 (meaning 999k)
                    const MAX_SALARY_K = 999;
                    const numValue = parseInt(value || '0');

                    if (numValue > MAX_SALARY_K) {
                      value = MAX_SALARY_K.toString();
                      setError(`Maximum salary is ${MAX_SALARY_K}k`);
                    } else {
                      setError('');
                    }

                    updateFormData('monthlyCompensation', value);
                  }}
                  min="0"
                  max="999"
                  placeholder="Enter amount (e.g., 25)"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none transition-colors duration-200 text-lg"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              <div className="relative min-w-[100px]">
                <select
                  value={formData.currency}
                  onChange={e => updateFormData('currency', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                  disabled={isLoading}
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Show current value in full format */}
            {formData.monthlyCompensation && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  Monthly salary:{' '}
                  <strong>
                    {parseInt(formData.monthlyCompensation).toLocaleString()}k{' '}
                    {formData.currency}
                  </strong>
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Work Mode Preference
            </h2>
            <p className="text-sm text-gray-600 mb-6">Select all that apply</p>
            <div className="space-y-4">
              {['remote', 'onsite', 'hybrid'].map(option => (
                <button
                  key={option}
                  onClick={() =>
                    toggleArraySelection('workArrangement', option)
                  }
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 capitalize ${
                    formData.workArrangement.includes(option)
                      ? 'bg-[#1F514C] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Are you open to relocating within your country?
            </h2>
            <div className="relative">
              <select
                value={formData.relocateWithinCountry}
                onChange={e =>
                  updateFormData('relocateWithinCountry', e.target.value)
                }
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                autoFocus
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">
              When can you start working?
            </h2>
            <div className="space-y-4">
              {['Immediate', '1-month', '2-months', '3-months'].map(option => (
                <button
                  key={option}
                  onClick={() => updateFormData('startTiming', option)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 ${
                    formData.startTiming === option
                      ? 'bg-[#1F514C] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Are you open to relocating outside your current city or country?
            </h2>
            <div className="relative">
              <select
                value={formData.relocateOutsideCountry}
                onChange={e =>
                  updateFormData('relocateOutsideCountry', e.target.value)
                }
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                autoFocus
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Just to confirm — are you absolutely okay relocating to outside
              your current location?
            </h2>
            <div className="relative">
              <select
                value={formData.relocationConfirmed}
                onChange={e =>
                  updateFormData('relocationConfirmed', e.target.value)
                }
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:border-[#1F514C] focus:outline-none appearance-none bg-white text-lg pr-10"
                autoFocus
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Select your preferred interview times
            </h2>
            <p className="text-sm text-gray-600 mb-6">Select all that apply</p>
            <div className="grid grid-cols-2 gap-4">
              {['morning', 'afternoon', 'evening', 'anytime'].map(time => (
                <button
                  key={time}
                  onClick={() => toggleArraySelection('interviewTime', time)}
                  disabled={isLoading}
                  className={`py-6 px-4 rounded-2xl text-lg font-medium transition-all duration-200 capitalize ${
                    formData.interviewTime.includes(time)
                      ? 'bg-[#1F514C] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 leading-tight">
            Let&apos;s Get to Know You Better
          </h1>
          <div className="text-sm text-gray-500 mb-2">
            Step {currentStep} of 8
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1F514C] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          {renderStep()}

          {/* Next Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 relative ${
                canProceed() && !isLoading
                  ? 'bg-[#1F514C] text-white hover:bg-[#164039] shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : currentStep === 8 ? (
                'Complete'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>

        {/* Back Button (except on first step) */}
        {currentStep > 1 && !isLoading && (
          <div className="text-center">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-[#1F514C] hover:text-emerald-800 font-medium transition-colors duration-200 text-xl"
            >
              ← Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowBetterQuestions;
