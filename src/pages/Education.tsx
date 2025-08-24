// import React, { useState } from 'react';
// import { BookOpen, Video, Download, Users, Heart, AlertCircle } from 'lucide-react';

// const Education: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState('overview');

//   const categories = [
//     { id: 'overview', label: 'About Thalassemia', icon: BookOpen },
//     { id: 'types', label: 'Types & Symptoms', icon: AlertCircle },
//     { id: 'treatment', label: 'Treatment Options', icon: Heart },
//     { id: 'support', label: 'Support & Care', icon: Users }
//   ];

//   const resources = [
//     {
//       title: 'Living with Thalassemia: A Complete Guide',
//       type: 'PDF Guide',
//       description: 'Comprehensive guide covering daily life management, diet, and care tips.',
//       downloads: 2340
//     },
//     {
//       title: 'Thalassemia Awareness Video Series',
//       type: 'Video Course',
//       description: 'Expert-led video series explaining Thalassemia in simple terms.',
//       downloads: 1560
//     },
//     {
//       title: 'Nutrition Guidelines for Thalassemia Patients',
//       type: 'Diet Plan',
//       description: 'Specialized diet recommendations and meal planning guide.',
//       downloads: 1890
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Thalassemia Education Center
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Learn about Thalassemia, treatment options, and how to live a healthy life with proper care and support.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Sidebar Navigation */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
//               <h3 className="font-semibold text-gray-900 mb-4">Topics</h3>
//               <nav className="space-y-2">
//                 {categories.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => setSelectedCategory(category.id)}
//                     className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
//                       selectedCategory === category.id
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <category.icon className="h-5 w-5" />
//                     <span>{category.label}</span>
//                   </button>
//                 ))}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               {selectedCategory === 'overview' && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-gray-900">What is Thalassemia?</h2>
                  
//                   <div className="prose max-w-none">
//                     <p className="text-gray-700 leading-relaxed mb-4">
//                       Thalassemia is a inherited blood disorder that affects the body's ability to produce hemoglobin and red blood cells. 
//                       People with thalassemia have fewer healthy red blood cells and less hemoglobin than normal, which can cause mild to severe anemia.
//                     </p>
                    
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//                       <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Facts</h3>
//                       <ul className="space-y-2 text-blue-800">
//                         <li>• Thalassemia is one of the most common genetic disorders worldwide</li>
//                         <li>• It affects millions of people globally, with higher prevalence in Mediterranean, Middle Eastern, and Asian populations</li>
//                         <li>• With proper treatment and care, people with thalassemia can lead normal, productive lives</li>
//                         <li>• Regular blood transfusions and iron chelation therapy are primary treatments</li>
//                       </ul>
//                     </div>

//                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Causes</h3>
//                     <p className="text-gray-700 leading-relaxed mb-4">
//                       Thalassemia is caused by mutations in the genes responsible for making hemoglobin. These mutations are inherited from parents. 
//                       If both parents carry the thalassemia gene, there's a chance their child may be born with thalassemia major.
//                     </p>

//                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Inheritance Pattern</h3>
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//                       <ul className="space-y-2 text-yellow-800">
//                         <li>• <strong>Thalassemia Minor:</strong> Person carries one defective gene (carrier)</li>
//                         <li>• <strong>Thalassemia Major:</strong> Person inherits defective genes from both parents</li>
//                         <li>• <strong>Genetic Counseling:</strong> Recommended for carriers before family planning</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {selectedCategory === 'types' && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-gray-900">Types and Symptoms</h2>
                  
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Alpha Thalassemia</h3>
//                       <p className="text-gray-700 mb-4">
//                         Caused by deletions or mutations in the alpha globin genes. Severity depends on how many genes are affected.
//                       </p>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Silent Carrier:</strong> No symptoms, 1 gene affected</p>
//                         <p><strong>Alpha Thal Minor:</strong> Mild anemia, 2 genes affected</p>
//                         <p><strong>HbH Disease:</strong> Moderate to severe anemia, 3 genes affected</p>
//                         <p><strong>Alpha Thal Major:</strong> Severe condition, 4 genes affected</p>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Beta Thalassemia</h3>
//                       <p className="text-gray-700 mb-4">
//                         Results from mutations in the beta globin gene. More common in Mediterranean populations.
//                       </p>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Beta Thal Minor:</strong> Mild anemia, usually no symptoms</p>
//                         <p><strong>Beta Thal Intermedia:</strong> Moderate anemia, may need occasional transfusions</p>
//                         <p><strong>Beta Thal Major:</strong> Severe anemia, requires regular transfusions</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-red-900 mb-3">Common Symptoms</h3>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <ul className="space-y-2 text-red-800">
//                         <li>• Fatigue and weakness</li>
//                         <li>• Pale skin and jaundice</li>
//                         <li>• Shortness of breath</li>
//                         <li>• Delayed growth in children</li>
//                       </ul>
//                       <ul className="space-y-2 text-red-800">
//                         <li>• Bone deformities</li>
//                         <li>• Enlarged spleen and liver</li>
//                         <li>• Heart problems</li>
//                         <li>• Iron overload complications</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {selectedCategory === 'treatment' && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-gray-900">Treatment Options</h2>
                  
//                   <div className="space-y-6">
//                     <div className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                         <Heart className="h-5 w-5 text-red-600 mr-2" />
//                         Blood Transfusions
//                       </h3>
//                       <p className="text-gray-700 mb-4">
//                         Regular blood transfusions are the primary treatment for thalassemia major, typically needed every 2-4 weeks.
//                       </p>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                         <h4 className="font-medium text-blue-900 mb-2">Transfusion Process:</h4>
//                         <ul className="text-sm text-blue-800 space-y-1">
//                           <li>• Pre-transfusion blood tests and crossmatching</li>
//                           <li>• Careful monitoring during transfusion</li>
//                           <li>• Post-transfusion hemoglobin level assessment</li>
//                           <li>• Regular screening for transfusion-related complications</li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Iron Chelation Therapy</h3>
//                       <p className="text-gray-700 mb-4">
//                         Essential for removing excess iron that builds up from regular blood transfusions.
//                       </p>
//                       <div className="grid md:grid-cols-3 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium mb-2">Deferasirox (Oral)</h4>
//                           <p className="text-sm text-gray-600">Once daily oral medication</p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium mb-2">Deferoxamine (Injection)</h4>
//                           <p className="text-sm text-gray-600">Subcutaneous infusion</p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium mb-2">Deferiprone (Oral)</h4>
//                           <p className="text-sm text-gray-600">Three times daily tablets</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Bone Marrow Transplant</h3>
//                       <p className="text-gray-700 mb-4">
//                         The only potential cure for thalassemia, requiring a compatible donor (usually a sibling).
//                       </p>
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                         <h4 className="font-medium text-green-900 mb-2">Success Factors:</h4>
//                         <ul className="text-sm text-green-800 space-y-1">
//                           <li>• HLA-matched donor availability</li>
//                           <li>• Patient's age and overall health</li>
//                           <li>• Absence of organ damage</li>
//                           <li>• Access to specialized transplant center</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {selectedCategory === 'support' && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-gray-900">Support and Care</h2>
                  
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="space-y-6">
//                       <div className="border border-gray-200 rounded-lg p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Support</h3>
//                         <ul className="space-y-2 text-gray-700">
//                           <li>• Join local thalassemia support groups</li>
//                           <li>• Connect with other families facing similar challenges</li>
//                           <li>• Seek genetic counseling for family planning</li>
//                           <li>• Educate extended family about the condition</li>
//                         </ul>
//                       </div>

//                       <div className="border border-gray-200 rounded-lg p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Lifestyle Management</h3>
//                         <ul className="space-y-2 text-gray-700">
//                           <li>• Maintain regular medical follow-ups</li>
//                           <li>• Follow prescribed treatment schedules</li>
//                           <li>• Stay up-to-date with vaccinations</li>
//                           <li>• Practice good hygiene to prevent infections</li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="space-y-6">
//                       <div className="border border-gray-200 rounded-lg p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Mental Health</h3>
//                         <ul className="space-y-2 text-gray-700">
//                           <li>• Professional counseling when needed</li>
//                           <li>• Stress management techniques</li>
//                           <li>• Building resilience and coping strategies</li>
//                           <li>• Maintaining social connections</li>
//                         </ul>
//                       </div>

//                       <div className="border border-gray-200 rounded-lg p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Educational Support</h3>
//                         <ul className="space-y-2 text-gray-700">
//                           <li>• School accommodation plans</li>
//                           <li>• Career guidance and planning</li>
//                           <li>• Scholarship opportunities</li>
//                           <li>• Skill development programs</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-purple-900 mb-3">Emergency Preparedness</h3>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <h4 className="font-medium text-purple-900 mb-2">Medical Emergency Kit:</h4>
//                         <ul className="text-sm text-purple-800 space-y-1">
//                           <li>• Medical alert bracelet or card</li>
//                           <li>• Emergency contact numbers</li>
//                           <li>• Recent blood test reports</li>
//                           <li>• Current medication list</li>
//                         </ul>
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-purple-900 mb-2">Warning Signs:</h4>
//                         <ul className="text-sm text-purple-800 space-y-1">
//                           <li>• Severe fatigue or weakness</li>
//                           <li>• Chest pain or irregular heartbeat</li>
//                           <li>• High fever or signs of infection</li>
//                           <li>• Severe headache or dizziness</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Resources Section */}
//         <div className="mt-12">
//           <div className="bg-white rounded-lg shadow-sm p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Educational Resources</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {resources.map((resource, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                   <div className="flex items-center space-x-3 mb-3">
//                     {resource.type === 'PDF Guide' && <Download className="h-6 w-6 text-red-600" />}
//                     {resource.type === 'Video Course' && <Video className="h-6 w-6 text-blue-600" />}
//                     {resource.type === 'Diet Plan' && <BookOpen className="h-6 w-6 text-green-600" />}
//                     <span className="text-sm font-medium text-gray-600">{resource.type}</span>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
//                   <p className="text-gray-600 mb-4">{resource.description}</p>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">{resource.downloads} downloads</span>
//                     <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
//                       Access Resource
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Education;
import React, { useState, useEffect } from 'react';
import { BookOpen, Video, Download, Users, Heart, AlertCircle } from 'lucide-react';
import apiClient from '../api/apiClient';

// --- Data structures to match our backend ---
interface Category {
  id: string;
  label: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  description: string;
  downloads: number;
}

// This matches the full data object from the /content endpoint
interface EducationContent {
  categories: Category[];
  articles: Article[];
  resources: Resource[];
}

const Education: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const [content, setContent] = useState<EducationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all content from the backend when the component loads
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/education/content');
        if (response.data.success) {
          setContent(response.data.data);
          // Set the default selected category to the first one from the API
          if (response.data.data.categories && response.data.data.categories.length > 0) {
            setSelectedCategory(response.data.data.categories[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load educational content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Helper to find specific articles from the fetched data
  const getArticle = (id: string) => content?.articles.find(a => a.id === id);

  if (loading) {
    return <div className="text-center p-10">Loading educational content...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thalassemia Education Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about Thalassemia, treatment options, and how to live a healthy life with proper care and support.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation (Dynamically built from backend) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Topics</h3>
              <nav className="space-y-2">
                {content?.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content (Your original structure, but with dynamic data) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Overview Section */}
              {selectedCategory === 'overview' && (
                <div className="space-y-6 prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900">{getArticle('overview')?.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{getArticle('overview')?.content}</p>
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Facts</h3>
                      <ul className="space-y-2 text-blue-800 list-disc pl-5">
                        <li>Thalassemia is one of the most common genetic disorders worldwide.</li>
                        <li>With proper treatment, people with thalassemia can lead productive lives.</li>
                        <li>Regular blood transfusions and iron chelation therapy are primary treatments.</li>
                      </ul>
                    </div>
                </div>
              )}

              {/* Treatment Section */}
              {selectedCategory === 'treatment' && (
                <div className="space-y-6 prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900">{getArticle('treatment')?.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{getArticle('treatment')?.content}</p>
                </div>
              )}

              {/* Support Section */}
              {selectedCategory === 'support' && (
                <div className="space-y-6 prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900">{getArticle('support')?.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{getArticle('support')?.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resources Section (Dynamically rendered) */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Educational Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content?.resources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    {resource.type.includes('PDF') && <Download className="h-6 w-6 text-red-600" />}
                    {resource.type.includes('Video') && <Video className="h-6 w-6 text-blue-600" />}
                    {resource.type.includes('Plan') && <BookOpen className="h-6 w-6 text-green-600" />}
                    <span className="text-sm font-medium text-gray-600">{resource.type}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{resource.downloads.toLocaleString()} downloads</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Access Resource
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;